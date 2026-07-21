/**
 * ============================================
 * COMPONENTE DE DASHBOARD (PANEL PRINCIPAL)
 * ============================================
 * 
 * Este componente muestra la pagina principal despues
 * de que el usuario ha iniciado sesion correctamente.
 * 
 * Funcionalidades:
 * - Muestra informacion del usuario autenticado
 * - Muestra el estado del servidor
 * - Permite cerrar sesion
 * - Protege la ruta (redirige al login si no hay sesion)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarEstado } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    // Variables de estado
    const [usuario, setUsuario] = useState(null);           // Datos del usuario
    const [estadoServidor, setEstadoServidor] = useState(null); // Estado del servidor
    const [cargando, setCargando] = useState(true);         // Estado de carga
    
    // Hook para navegar entre paginas
    const navigate = useNavigate();

    // Se ejecuta cuando el componente se carga por primera vez
    useEffect(() => {
        // Verificar si hay sesion activa
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        
        // Si no hay token, redirigir al login
        if (!token || !usuarioGuardado) {
            navigate('/login');
            return;
        }
        
        // Cargar datos del usuario desde localStorage
        setUsuario(JSON.parse(usuarioGuardado));
        
        // Obtener estado del servidor
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
     * Cerrar sesion
     * Elimina los datos del localStorage y redirige al login
     */
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    // Mostrar pantalla de carga mientras se obtienen los datos
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
        // Contenedor principal
        <div className="dashboard-container">
            {/* Tarjeta del dashboard */}
            <div className="dashboard-card">
                {/* Encabezado con titulo y boton de cerrar sesion */}
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <button className="boton-cerrar-sesion" onClick={cerrarSesion}>
                        Cerrar Sesion
                    </button>
                </div>
                
                {/* Contenido del dashboard */}
                <div className="dashboard-contenido">
                    
                    {/* Seccion: Informacion del usuario */}
                    <div className="seccion usuario-info">
                        <h2>Informacion del Usuario</h2>
                        <div className="info-item">
                            <span className="etiqueta">ID:</span>
                            <span className="valor">{usuario?.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="etiqueta">Usuario:</span>
                            <span className="valor">{usuario?.username}</span>
                        </div>
                    </div>
                    
                    {/* Seccion: Estado del servidor */}
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
                            <span className="etiqueta">Ultima Verificacion:</span>
                            <span className="valor">
                                {new Date(estadoServidor?.timestamp).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    
                    {/* Seccion: Mensaje de bienvenida */}
                    <div className="seccion mensaje-bienvenida">
                        <h2>Bienvenido!</h2>
                        <p>Has iniciado sesion correctamente en el sistema de autenticacion.</p>
                        <p>Esta es una demostracion de una API construida con React y Express.js.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;