/**
 * ============================================
 * COMPONENTE PRINCIPAL DE LA APLICACION
 * ============================================
 * 
 * Este es el archivo raiz de React que configura
 * las rutas de navegacion de la aplicacion.
 * 
 * Rutas disponibles:
 * - /         -> Redirige a login
 * - /login    -> Pagina de inicio de sesion
 * - /register -> Pagina de registro
 * - /dashboard -> Panel principal (requiere sesion)
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    return (
        // Router permite navegar entre paginas sin recargar
        <Router>
            <div className="App">
                {/* Definicion de rutas */}
                <Routes>
                    {/* Ruta para iniciar sesion */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Ruta para crear cuenta */}
                    <Route path="/register" element={<Register />} />
                    
                    {/* Ruta del panel principal */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* La ruta raiz redirige a login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    
                    {/* Cualquier otra ruta redirige a login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;