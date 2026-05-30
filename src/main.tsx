/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                         PUNTO DE ENTRADA - MAIN.TSX                      ║
 * ║  Este archivo es el primero que se ejecuta cuando carga la aplicación    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * 
 * ¿QUÉ HACE?
 * 1. Importa React y las librerías necesarias
 * 2. Importa el componente App (el cerebro de la aplicación)
 * 3. Busca el elemento HTML con id="root" (está en index.html)
 * 4. Renderiza la aplicación dentro de ese elemento
 * 
 * ¿POR QUÉ ES IMPORTANTE?
 * Sin este archivo, React no sabría dónde dibujar la interfaz en la página.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos globales (si los tienes)
// import './index.css';

// ═══════════════════════════════════════════════════════════════════════════
// RENDERIZADO DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════════════════════

// Buscamos el elemento con id="root" en el HTML
const rootElement = document.getElementById('root');

// Verificamos que exista (buena práctica)
if (!rootElement) {
  throw new Error('No se encontró el elemento root. Verifica tu index.html');
}

// Creamos la "raíz" de React y renderizamos la aplicación
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * React.StrictMode es una herramienta de desarrollo que:
 * - Detecta potenciales problemas en la aplicación
 * - Ayuda a preparar el código para futuras versiones de React
 * - No afecta el rendimiento en producción
 */
