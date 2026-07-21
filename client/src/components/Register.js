/**
 * ============================================
 * COMPONENTE DE REGISTRO DE USUARIO
 * ============================================
 * 
 * Este componente muestra un formulario donde el usuario
 * puede crear una nueva cuenta en el sistema.
 * 
 * Funcionalidades:
 * - Formulario con 3 campos (usuario, contraseña, confirmar)
 * - Validacion de contraseñas coincidentes
 * - Validacion de longitud minima de contraseña
 * - Redirige al login despues del registro
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api';
import './Register.css';

const Register = () => {
    // Variables de estado para los campos del formulario
    const [username, setUsername] = useState('');            // Nombre de usuario
    const [password, setPassword] = useState('');            // Contraseña
    const [confirmarPassword, setConfirmarPassword] = useState(''); // Confirmar contraseña
    
    // Variables de estado para mensajes
    const [error, setError] = useState('');      // Mensaje de error
    const [exito, setExito] = useState('');      // Mensaje de exito
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
        
        // Validar que todos los campos tengan contenido
        if (!username.trim() || !password.trim() || !confirmarPassword.trim()) {
            setError('Por favor, completa todos los campos');
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (password !== confirmarPassword) {
            setError('Las contrasenas no coinciden');
            return;
        }
        
        // Validar longitud minima de la contraseña (6 caracteres)
        if (password.length < 6) {
            setError('La contrasena debe tener al menos 6 caracteres');
            return;
        }
        
        // Activar estado de carga
        setCargando(true);
        
        try {
            // Llamar al servicio de registro
            const resultado = await registrarUsuario(username, password);
            
            // Mostrar mensaje de exito
            setExito(resultado.mensaje);
            
            // Redirigir al login despues de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            // Mostrar error si falla el registro
            setError(err.error || 'Error al registrar usuario');
        } finally {
            // Desactivar estado de carga
            setCargando(false);
        }
    };

    return (
        // Contenedor principal con fondo degradado verde
        <div className="register-container">
            {/* Tarjeta del formulario */}
            <div className="register-card">
                <h2 className="register-titulo">Crear Cuenta</h2>
                
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
                
                {/* Formulario de registro */}
                <form onSubmit={manejarEnvio}>
                    {/* Campo de usuario */}
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
                    
                    {/* Campo de contraseña */}
                    <div className="campo-grupo">
                        <label htmlFor="password">Contrasena</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimo 6 caracteres"
                            disabled={cargando}
                        />
                    </div>
                    
                    {/* Campo de confirmar contraseña */}
                    <div className="campo-grupo">
                        <label htmlFor="confirmarPassword">Confirmar Contrasena</label>
                        <input
                            type="password"
                            id="confirmarPassword"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            placeholder="Repite tu contrasena"
                            disabled={cargando}
                        />
                    </div>
                    
                    {/* Boton de registro */}
                    <button 
                        type="submit" 
                        className="boton-register"
                        disabled={cargando}
                    >
                        {cargando ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>
                
                {/* Enlace para ir a login */}
                <div className="enlace-login">
                    Ya tienes una cuenta? 
                    <Link to="/login">Inicia sesion</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;