/**
 * API de Autenticación
 * 
 * Este servicio web permite:
 * 1. Registrar nuevos usuarios
 * 2. Iniciar sesión con credenciales válidas
 * 
 * Endpoints:
 * - POST /api/register: Registrar un nuevo usuario
 * - POST /api/login: Iniciar sesión
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Clave secreta para firmar tokens JWT (en producción usar variable de entorno)
const JWT_SECRET = 'mi_clave_secreta_segura_2024';

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Middleware para permitir solicitudes desde el frontend (CORS)
app.use(cors());

// Almacén temporal de usuarios (en producción usar base de datos)
const usuarios = [];

/**
 * Ruta para registrar un nuevo usuario
 * 
 * Recibe:
 * - username: nombre de usuario
 * - password: contraseña del usuario
 * 
 * Retorna:
 * - 201: Registro exitoso con mensaje
 * - 400: Error si el usuario ya existe o faltan datos
 */
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // Validar que se proporcionen username y password
    if (!username || !password) {
        return res.status(400).json({ 
            error: 'Username y password son requeridos' 
        });
    }

    // Verificar si el usuario ya existe en el sistema
    const usuarioExistente = usuarios.find(u => u.username === username);
    if (usuarioExistente) {
        return res.status(400).json({ 
            error: 'El usuario ya existe en el sistema' 
        });
    }

    // Cifrar la contraseña con bcrypt (hash de 10 rondas)
    const passwordCifrado = bcrypt.hashSync(password, 10);

    // Crear objeto de usuario con datos cifrados
    const nuevoUsuario = {
        id: usuarios.length + 1,
        username,
        password: passwordCifrado,
        fechaCreacion: new Date()
    };

    // Guardar usuario en el almacén
    usuarios.push(nuevoUsuario);

    console.log(`Usuario registrado exitosamente: ${username}`);

    // Retornar respuesta exitosa (sin incluir la contraseña)
    res.status(201).json({ 
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
            id: nuevoUsuario.id,
            username: nuevoUsuario.username,
            fechaCreacion: nuevoUsuario.fechaCreacion
        }
    });
});

/**
 * Ruta para iniciar sesión
 * 
 * Recibe:
 * - username: nombre de usuario
 * - password: contraseña del usuario
 * 
 * Retorna:
 * - 200: Autenticación satisfactoria con token JWT
 * - 401: Error de autenticación si credenciales son incorrectas
 * - 400: Error si faltan datos
 */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Validar que se proporcionen username y password
    if (!username || !password) {
        return res.status(400).json({ 
            error: 'Username y password son requeridos' 
        });
    }

    // Buscar el usuario en el almacén
    const usuario = usuarios.find(u => u.username === username);

    // Verificar si el usuario existe
    if (!usuario) {
        return res.status(401).json({ 
            error: 'Error en la autenticación: usuario no encontrado' 
        });
    }

    // Verificar si la contraseña coincide con el hash almacenado
    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
        return res.status(401).json({ 
            error: 'Error en la autenticación: contraseña incorrecta' 
        });
    }

    // Generar token JWT con información del usuario
    const token = jwt.sign(
        { 
            id: usuario.id, 
            username: usuario.username 
        },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expira en 1 hora
    );

    console.log(`Inicio de sesión exitoso: ${username}`);

    // Retornar respuesta exitosa con token
    res.json({ 
        mensaje: 'Autenticación satisfactoria',
        token,
        usuario: {
            id: usuario.id,
            username: usuario.username
        }
    });
});

/**
 * Ruta para verificar estado del servidor
 * 
 * Retorna:
 * - 200: Mensaje de confirmación
 */
app.get('/api/status', (req, res) => {
    res.json({ 
        mensaje: 'API de autenticación funcionando correctamente',
        timestamp: new Date(),
        usuariosRegistrados: usuarios.length
    });
});

// Iniciar servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor de autenticación ejecutándose en http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
    console.log(`  - POST http://localhost:${PORT}/api/register`);
    console.log(`  - POST http://localhost:${PORT}/api/login`);
    console.log(`  - GET  http://localhost:${PORT}/api/status`);
});