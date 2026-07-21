/**
 * ============================================
 * COMPONENTE DE INICIO DE SESION
 * ============================================
 * 
 * Este componente muestra un formulario donde el usuario
 * puede ingresar su usuario y contraseña para acceder
 * al sistema.
 * 
 * Funcionalidades:
 * - Formulario con validacion
 * - Muestra mensajes de error o exito
 * - Redirige al dashboard despues del login
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/api';
import './Login.css';

const Login = () => {
    // Variables de estado para los campos del formulario
    const [username, setUsername] = useState('');  // Nombre de usuario
    const [password, setPassword] = useState('');  // Contraseña
    
    // Variables de estado para mensajes
    const [error, setError] = useState('');        // Mensaje de error
    const [exito, setExito] = useState('');        // Mensaje de exito
    const [cargando, setCargando] = useState(false); // Estado de carga
    
    // Hook para navegar entre paginas
    const navigate = useNavigate();

    /**
     * Funcion que se ejecuta al enviar el formulario
     * Valida los datos y envia la peticion al backend
     */
    const manejarEnvio = async (e) => {
        // Evitar que el formulario recargue la pagina
        e.preventDefault();
        
        // Limpiar mensajes anteriores
        setError('');
        setExito('');
        
        // Validar que ambos campos tengan contenido
        if (!username.trim() || !password.trim()) {
            setError('Por favor, completa todos los campos');
            return;
        }
        
        // Activar estado de carga
        setCargando(true);
        
        try {
            // Llamar al servicio de login
            const resultado = await iniciarSesion(username, password);
            
            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('token', resultado.token);
            localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            
            // Mostrar mensaje de exito
            setExito(resultado.mensaje);
            
            // Redirigir al dashboard despues de 1.5 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (err) {
            // Mostrar error si falla el login
            setError(err.error || 'Error al iniciar sesion');
        } finally {
            // Desactivar estado de carga
            setCargando(false);
        }
    };

    return (
        // Contenedor principal con fondo degradado
        <div className="login-container">
            {/* Tarjeta del formulario */}
            <div className="login-card">
                <h2 className="login-titulo">Iniciar Sesion</h2>
                
                {/* Mostrar mensaje de error si existe */}
                {error && (
                    <div className="mensaje-error">
                        {error}
                    </div>
                )}
                
                {/* Mostrar mensaje de exito si existe */}
                {exito && (
                    <div className="mensaje-exito">
                        {exito}
                    </div>
                )}
                
                {/* Formulario de login */}
                <form onSubmit={manejarEnvio}>
                    {/* Campo de usuario */}
                    <div className="campo-grupo">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            disabled={cargando}
                        />
                    </div>
                    
                    {/* Campo de contraseña */}
                    <div className="campo-grupo">
                        <label htmlFor="password">Contrasena</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contrasena"
                            disabled={cargando}
                        />
                    </div>
                    
                    {/* Boton de envio */}
                    <button 
                        type="submit" 
                        className="boton-login"
                        disabled={cargando}
                    >
                        {cargando ? 'Iniciando sesion...' : 'Iniciar Sesion'}
                    </button>
                </form>
                
                {/* Enlace para ir a registro */}
                <div className="enlace-registro">
                    No tienes una cuenta? 
                    <Link to="/register">Registrate aqui</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;