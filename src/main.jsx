import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

// ==========================================================================
// PONTO DE ENTRADA DA APLICAÇÃO (main.jsx)
// Ctrl+F: PONTO-DE-ENTRADA
// --------------------------------------------------------------------------
// Aqui o React é "montado" dentro da div #root (definida no index.html).
//
// - React.StrictMode: ferramenta de desenvolvimento que ajuda a detectar
//   problemas no código (não afeta a versão final).
// - BrowserRouter: habilita o uso de ROTAS (React Router DOM) em toda a app.
//   Tudo que estiver dentro dele pode navegar entre páginas via URL.
// ==========================================================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
