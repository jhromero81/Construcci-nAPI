/**
 * Componente de Dashboard
 * 
 * Este componente muestra la página principal después
 * de que el usuario ha iniciado sesión correctamente.
 * 
 * Características:
 * - Muestra información del usuario autenticado
 * - Permite cerrar sesión
 * - Protección de ruta (solo usuarios autenticados)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarEstado } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    // Estado del usuario
    const [usuario, setUsuario] = useState(null);
    const [estadoServidor, setEstadoServidor] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // Hook para navegación
    const navigate = useNavigate();

    // Efecto para cargar datos al montar el componente
    useEffect(() => {
        // Verificar si hay token en localStorage
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        
        if (!token || !usuarioGuardado) {
            // Si no hay token, redirigir al login
            navigate('/login');
            return;
        }
        
        // Parsear datos del usuario
        setUsuario(JSON.parse(usuarioGuardado));
        
        // Verificar estado del servidor
        const obtenerEstado = async () => {
            try {
                const estado = await verificarEstado();
                setEstadoServidor(estado);
            } catch (error) {
                console.error('Error al verificar estado:', error);
            } finally {
                setCargando(false);
            }
        };
        
        obtenerEstado();
    }, [navigate]);

    /**
     * Cerrar sesión
     * Elimina el token del localStorage y redirige al login
     */
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    // Mostrar indicador de carga
    if (cargando) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-card">
                    <div className="cargando">Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <button className="boton-cerrar-sesion" onClick={cerrarSesion}>
                        Cerrar Sesión
                    </button>
                </div>
                
                <div className="dashboard-contenido">
                    <div className="seccion usuario-info">
                        <h2>Información del Usuario</h2>
                        <div className="info-item">
                            <span className="etiqueta">ID:</span>
                            <span className="valor">{usuario?.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="etiqueta">Usuario:</span>
                            <span className="valor">{usuario?.username}</span>
                        </div>
                    </div>
                    
                    <div className="seccion servidor-info">
                        <h2>Estado del Servidor</h2>
                        <div className="info-item">
                            <span className="etiqueta">Mensaje:</span>
                            <span className="valor">{estadoServidor?.mensaje}</span>
                        </div>
                        <div className="info-item">
                            <span className="etiqueta">Usuarios Registrados:</span>
                            <span className="valor">{estadoServidor?.usuariosRegistrados}</span>
                        </div>
                        <div className="info-item">
                            <span className="etiqueta">Última Verificación:</span>
                            <span className="valor">
                                {new Date(estadoServidor?.timestamp).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    
                    <div className="seccion mensaje-bienvenida">
                        <h2>¡Bienvenido!</h2>
                        <p>Has iniciado sesión correctamente en el sistema de autenticación.</p>
                        <p>Esta es una demostración de una API construida con React y Express.js.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;