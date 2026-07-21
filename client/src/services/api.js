/**
 * ============================================
 * SERVICIO DE API - COMUNICACION CON EL BACKEND
 * ============================================
 * 
 * Este archivo contiene las funciones que se comunican
 * con el servidor backend para realizar:
 * - Registro de usuarios
 * - Inicio de sesion
 * - Verificacion de estado
 * 
 * Utiliza Axios para hacer las peticiones HTTP.
 */

import axios from 'axios';

// URL base del servidor backend (puerto 3001)
const API_URL = 'http://localhost:3001/api';

/**
 * Registrar un nuevo usuario
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Respuesta del servidor con datos del usuario
 */
export const registrarUsuario = async (username, password) => {
    try {
        // Enviar peticion POST al endpoint de registro
        const response = await axios.post(`${API_URL}/register`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        // Si hay error, retornar mensaje del servidor o mensaje generico
        throw error.response?.data || { error: 'Error de conexion con el servidor' };
    }
};

/**
 * Iniciar sesion
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Respuesta con token JWT y datos del usuario
 */
export const iniciarSesion = async (username, password) => {
    try {
        // Enviar peticion POST al endpoint de login
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        // Si hay error, retornar mensaje del servidor o mensaje generico
        throw error.response?.data || { error: 'Error de conexion con el servidor' };
    }
};

/**
 * Verificar estado del servidor
 * 
 * @returns {Promise} Estado actual del servidor
 */
export const verificarEstado = async () => {
    try {
        // Enviar peticion GET al endpoint de status
        const response = await axios.get(`${API_URL}/status`);
        return response.data;
    } catch (error) {
        // Si hay error, retornar mensaje del servidor o mensaje generico
        throw error.response?.data || { error: 'Error de conexion con el servidor' };
    }
};