require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_segura_2024';

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username y password son requeridos' 
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'El usuario ya existe en el sistema' 
      });
    }

    const passwordCifrado = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: passwordCifrado
    });

    await newUser.save();

    console.log(`Usuario registrado exitosamente: ${username}`);

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: newUser._id,
        username: newUser.username,
        fechaCreacion: newUser.fechaCreacion
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username y password son requeridos' 
      });
    }

    const usuario = await User.findOne({ username });

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Error en la autenticacion: usuario no encontrado' 
      });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Error en la autenticacion: contrasena incorrecta' 
      });
    }

    const token = jwt.sign(
      { 
        id: usuario._id, 
        username: usuario.username 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Inicio de sesion exitoso: ${username}`);

    res.json({ 
      mensaje: 'Autenticacion satisfactoria',
      token,
      usuario: {
        id: usuario._id,
        username: usuario.username
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ 
      mensaje: 'API de autenticacion funcionando correctamente',
      timestamp: new Date(),
      usuariosRegistrados: userCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de autenticacion ejecutandose en http://localhost:${PORT}`);
  console.log('Endpoints disponibles:');
  console.log(`  - POST http://localhost:${PORT}/api/register`);
  console.log(`  - POST http://localhost:${PORT}/api/login`);
  console.log(`  - GET  http://localhost:${PORT}/api/status`);
});
