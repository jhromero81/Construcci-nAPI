/**
 * ============================================
 * SERVIDOR PRINCIPAL - API DE AUTENTICACION
 * ============================================
 * 
 * Este archivo contiene el servidor backend que maneja:
 * - Registro de nuevos usuarios
 * - Inicio de sesion con usuario y contraseña
 * - Verificacion de estado del servidor
 * 
 * Tecnologias utilizadas:
 * - Express.js: Framework para crear el servidor web
 * - bcryptjs: Para cifrar las contraseñas
 * - jsonwebtoken: Para crear tokens de autenticacion
 * - cors: Para permitir conexiones desde el frontend
 */

// Importar las librerias necesarias
const express = require('express');   // Framework web
const bcrypt = require('bcryptjs');   // Cifrado de contraseñas
const jwt = require('jsonwebtoken');  // Tokens de autenticacion
const cors = require('cors');         // Permite conexiones cross-origin

// Crear la aplicacion Express
const app = express();

// Puerto donde escuchara el servidor
const PORT = 3001;

// Clave secreta para firmar los tokens (en produccion usar variable de entorno)
const JWT_SECRET = 'mi_clave_secreta_segura_2024';

// =====================
// CONFIGURACION DEL SERVIDOR
// =====================

// Middleware: permite recibir datos en formato JSON
app.use(express.json());

// Middleware: permite conexiones desde otros origenes (frontend)
app.use(cors());

// =====================
// ALMACEN DE USUARIOS
// =====================

// Array temporal para guardar usuarios (en produccion usar base de datos)
const usuarios = [];

// =====================
// RUTAS (ENDPOINTS)
// =====================

/**
 * POST /api/register
 * 
 * Registra un nuevo usuario en el sistema.
 * 
 * Datos que recibe:
 *   - username: nombre de usuario
 *   - password: contraseña del usuario
 * 
 * Respuestas:
 *   - 201: Registro exitoso
 *   - 400: Error (usuario ya existe o faltan datos)
 */
app.post('/api/register', (req, res) => {
    // Obtener datos del cuerpo de la peticion
    const { username, password } = req.body;

    // Validar que ambos campos esten presentes
    if (!username || !password) {
        return res.status(400).json({ 
            error: 'Username y password son requeridos' 
        });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(u => u.username === username);
    if (usuarioExistente) {
        return res.status(400).json({ 
            error: 'El usuario ya existe en el sistema' 
        });
    }

    // Cifrar la contraseña (10 rondas de hashing)
    const passwordCifrado = bcrypt.hashSync(password, 10);

    // Crear el nuevo usuario con id autoincremental
    const nuevoUsuario = {
        id: usuarios.length + 1,
        username,
        password: passwordCifrado,
        fechaCreacion: new Date()
    };

    // Guardar el usuario en el array
    usuarios.push(nuevoUsuario);

    // Mensaje en consola para debug
    console.log(`Usuario registrado exitosamente: ${username}`);

    // Enviar respuesta exitosa (sin incluir la contraseña)
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
 * POST /api/login
 * 
 * Inicia sesion con las credenciales del usuario.
 * 
 * Datos que recibe:
 *   - username: nombre de usuario
 *   - password: contraseña del usuario
 * 
 * Respuestas:
 *   - 200: Login exitoso con token JWT
 *   - 401: Error (credenciales incorrectas)
 *   - 400: Error (faltan datos)
 */
app.post('/api/login', (req, res) => {
    // Obtener datos del cuerpo de la peticion
    const { username, password } = req.body;

    // Validar que ambos campos esten presentes
    if (!username || !password) {
        return res.status(400).json({ 
            error: 'Username y password son requeridos' 
        });
    }

    // Buscar el usuario por nombre de usuario
    const usuario = usuarios.find(u => u.username === username);

    // Si el usuario no existe
    if (!usuario) {
        return res.status(401).json({ 
            error: 'Error en la autenticacion: usuario no encontrado' 
        });
    }

    // Verificar si la contraseña coincide con la almacenada
    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
        return res.status(401).json({ 
            error: 'Error en la autenticacion: contrasena incorrecta' 
        });
    }

    // Crear token JWT con datos del usuario
    const token = jwt.sign(
        { 
            id: usuario.id, 
            username: usuario.username 
        },
        JWT_SECRET,
        { expiresIn: '1h' }  // El token expira en 1 hora
    );

    // Mensaje en consola para debug
    console.log(`Inicio de sesion exitoso: ${username}`);

    // Enviar respuesta con el token
    res.json({ 
        mensaje: 'Autenticacion satisfactoria',
        token,
        usuario: {
            id: usuario.id,
            username: usuario.username
        }
    });
});

/**
 * GET /api/status
 * 
 * Verifica que el servidor este funcionando.
 * 
 * Respuestas:
 *   - 200: Mensaje de confirmacion con informacion del servidor
 */
app.get('/api/status', (req, res) => {
    res.json({ 
        mensaje: 'API de autenticacion funcionando correctamente',
        timestamp: new Date(),
        usuariosRegistrados: usuarios.length
    });
});

// =====================
// INICIAR SERVIDOR
// =====================

// Escuchar conexiones en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor de autenticacion ejecutandose en http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
    console.log(`  - POST http://localhost:${PORT}/api/register`);
    console.log(`  - POST http://localhost:${PORT}/api/login`);
    console.log(`  - GET  http://localhost:${PORT}/api/status`);
});