/**
 * Componente Principal de la Aplicación
 * 
 * Este es el componente raíz que maneja el enrutamiento
 * de la aplicación de autenticación.
 * 
 * Rutas:
 * - /login: Página de inicio de sesión
 * - /register: Página de registro
 * - /dashboard: Panel principal (requiere autenticación)
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                {/* Definición de rutas de la aplicación */}
                <Routes>
                    {/* Ruta de inicio de sesión */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Ruta de registro */}
                    <Route path="/register" element={<Register />} />
                    
                    {/* Ruta del dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Redirigir ruta raíz al login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    
                    {/* Ruta por defecto para rutas no encontradas */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;