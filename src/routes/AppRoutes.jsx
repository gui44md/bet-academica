import { Routes, Route } from 'react-router-dom'
import RotaProtegida from './RotaProtegida'

// Páginas (telas) da aplicação
import Login from '../pages/Login'
import DashboardAdmin from '../pages/DashboardAdmin'
import GerenciarEventos from '../pages/GerenciarEventos'
import DashboardJogador from '../pages/DashboardJogador'
import EventosDisponiveis from '../pages/EventosDisponiveis'
import TelaAposta from '../pages/TelaAposta'
import HistoricoApostas from '../pages/HistoricoApostas'
import Ranking from '../pages/Ranking'
import Regulamento from '../pages/Regulamento'

// ==========================================================================
// DEFINIÇÃO DAS ROTAS (routes/AppRoutes.jsx)
// Ctrl+F: APP-ROTAS
// --------------------------------------------------------------------------
// Usa o React Router DOM para mapear cada URL a uma página.
// As rotas administrativas e de jogador ficam dentro de <RotaProtegida>,
// garantindo o controle de acesso por perfil.
// ==========================================================================
export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública: tela de login */}
      <Route path="/" element={<Login />} />

      {/* -------- ROTAS DO ADMINISTRADOR (perfil = admin) -------- */}
      {/* Ctrl+F: APP-ROTAS-ADMIN */}
      <Route
        path="/admin"
        element={
          <RotaProtegida perfilExigido="admin">
            <DashboardAdmin />
          </RotaProtegida>
        }
      />
      <Route
        path="/admin/eventos"
        element={
          <RotaProtegida perfilExigido="admin">
            <GerenciarEventos />
          </RotaProtegida>
        }
      />

      {/* -------- ROTAS DO JOGADOR (perfil = usuario) -------- */}
      {/* Ctrl+F: APP-ROTAS-JOGADOR */}
      <Route
        path="/jogador"
        element={
          <RotaProtegida perfilExigido="usuario">
            <DashboardJogador />
          </RotaProtegida>
        }
      />
      <Route
        path="/jogador/eventos"
        element={
          <RotaProtegida perfilExigido="usuario">
            <EventosDisponiveis />
          </RotaProtegida>
        }
      />
      <Route
        path="/jogador/apostar/:eventoId"
        element={
          <RotaProtegida perfilExigido="usuario">
            <TelaAposta />
          </RotaProtegida>
        }
      />
      <Route
        path="/jogador/historico"
        element={
          <RotaProtegida perfilExigido="usuario">
            <HistoricoApostas />
          </RotaProtegida>
        }
      />

      {/* -------- ROTAS COMPARTILHADAS (qualquer logado) -------- */}
      {/* Ctrl+F: APP-ROTAS-COMUNS */}
      <Route
        path="/ranking"
        element={
          <RotaProtegida>
            <Ranking />
          </RotaProtegida>
        }
      />
      <Route
        path="/regulamento"
        element={
          <RotaProtegida>
            <Regulamento />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}
