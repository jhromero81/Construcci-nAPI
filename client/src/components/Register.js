/**
 * Componente de Registro
 * 
 * Este componente permite a los usuarios crear una nueva
 * cuenta en el sistema ingresando usuario y contraseña.
 * 
 * Características:
 * - Formulario controlado con React
 * - Validación de contraseña
 * - Manejo de estados de carga y error
 * - Redirección al login tras registro exitoso
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api';
import './Register.css';

const Register = () => {
    // Estado del formulario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    
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
        if (!username.trim() || !password.trim() || !confirmarPassword.trim()) {
            setError('Por favor, completa todos los campos');
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        setCargando(true);
        
        try {
            // Llamar al servicio de registro
            const resultado = await registrarUsuario(username, password);
            
            setExito(resultado.mensaje);
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            // Mostrar error del servidor
            setError(err.error || 'Error al registrar usuario');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-titulo">Crear Cuenta</h2>
                
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
                            placeholder="Elige un nombre de usuario"
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
                            placeholder="Mínimo 6 caracteres"
                            disabled={cargando}
                        />
                    </div>
                    
                    <div className="campo-grupo">
                        <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmarPassword"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            disabled={cargando}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="boton-register"
                        disabled={cargando}
                    >
                        {cargando ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>
                
                <div className="enlace-login">
                    ¿Ya tienes una cuenta? 
                    <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;