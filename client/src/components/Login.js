/**
 * Componente de Inicio de Sesión
 * 
 * Este componente permite a los usuarios autenticarse
 * en el sistema ingresando su usuario y contraseña.
 * 
 * Características:
 * - Formulario controlado con React
 * - Manejo de estados de carga y error
 * - Redirección al dashboard tras login exitoso
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/api';
import './Login.css';

const Login = () => {
    // Estado del formulario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Estados de UI
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [cargando, setCargando] = useState(false);
    
    // Hook para navegación
    const navigate = useNavigate();

    /**
     * Manejar el envío del formulario
     * Valida los campos y envía la petición al backend
     */
    const manejarEnvio = async (e) => {
        e.preventDefault();
        
        // Limpiar mensajes anteriores
        setError('');
        setExito('');
        
        // Validar que los campos no estén vacíos
        if (!username.trim() || !password.trim()) {
            setError('Por favor, completa todos los campos');
            return;
        }
        
        setCargando(true);
        
        try {
            // Llamar al servicio de autenticación
            const resultado = await iniciarSesion(username, password);
            
            // Almacenar token en localStorage
            localStorage.setItem('token', resultado.token);
            localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            
            setExito(resultado.mensaje);
            
            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (err) {
            // Mostrar error del servidor
            setError(err.error || 'Error al iniciar sesión');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-titulo">Iniciar Sesión</h2>
                
                {/* Mostrar mensaje de error */}
                {error && (
                    <div className="mensaje-error">
                        {error}
                    </div>
                )}
                
                {/* Mostrar mensaje de éxito */}
                {exito && (
                    <div className="mensaje-exito">
                        {exito}
                    </div>
                )}
                
                <form onSubmit={manejarEnvio}>
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
                    
                    <div className="campo-grupo">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            disabled={cargando}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="boton-login"
                        disabled={cargando}
                    >
                        {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
                
                <div className="enlace-registro">
                    ¿No tienes una cuenta? 
                    <Link to="/register">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;