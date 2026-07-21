/**
 * Servicio de API
 * 
 * Este módulo maneja todas las peticiones HTTP al backend
 * de autenticación. Utiliza Axios para realizar las peticiones.
 */

import axios from 'axios';

// URL base del backend de autenticación (puerto 3001)
const API_URL = 'http://localhost:3001/api';

/**
 * Registrar un nuevo usuario
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Respuesta del servidor
 */
export const registrarUsuario = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        // Retornar error del servidor o error de red
        throw error.response?.data || { error: 'Error de conexión con el servidor' };
    }
};

/**
 * Iniciar sesión
 * 
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Respuesta del servidor con token JWT
 */
export const iniciarSesion = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        // Retornar error del servidor o error de red
        throw error.response?.data || { error: 'Error de conexión con el servidor' };
    }
};

/**
 * Verificar estado del servidor
 * 
 * @returns {Promise} Estado del servidor
 */
export const verificarEstado = async () => {
    try {
        const response = await axios.get(`${API_URL}/status`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Error de conexión con el servidor' };
    }
};