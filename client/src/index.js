/**
 * ============================================
 * ARCHIVO DE ENTRADA DE LA APLICACION
 * ============================================
 * 
 * Este es el primer archivo que se ejecuta en React.
 * Se encarga de renderizar (mostrar) la aplicacion
 * en el navegador.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Obtener el elemento HTML donde se mostrara la app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicacion
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);