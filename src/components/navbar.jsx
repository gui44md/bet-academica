import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ==========================================================================
// COMPONENTE REUTILIZÁVEL - BARRA DE NAVEGAÇÃO (components/Navbar.jsx)
// Ctrl+F: COMPONENTE-NAVBAR
// --------------------------------------------------------------------------
// Cabeçalho exibido em todas as telas internas.
// Mostra links diferentes dependendo do PERFIL do usuário logado:
//   - admin   -> Dashboard, Eventos
//   - usuario -> Dashboard, Eventos, Histórico, e o SALDO fictício
// Ambos veem Ranking e Regulamento, além do botão "Sair".
// ==========================================================================
export default function Navbar() {
  // Pegamos o usuário e a função de logout do Context API.
  const { usuario, logout } = useAuth();
  // useNavigate: hook do React Router para navegar via código.
  const navigate = useNavigate();

  // Executa o logout e volta para a tela de login.
  function handleSair() {
    logout();
    navigate("/");
  }

  // Se ninguém estiver logado, não renderiza a navbar.
  if (!usuario) return null;

  const ehAdmin = usuario.perfil === "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-bet mb-4">
      <div className="container">
        <span className="navbar-brand fw-bold">⚽ UniBet</span>

        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* Links exclusivos do ADMINISTRADOR */}
          {ehAdmin && (
            <>
              <Link className="nav-link text-white" to="/admin">
                Dashboard
              </Link>
              <Link className="nav-link text-white" to="/admin/eventos">
                Eventos
              </Link>
            </>
          )}

          {/* Links exclusivos do JOGADOR */}
          {!ehAdmin && (
            <>
              <Link className="nav-link text-white" to="/jogador">
                Dashboard
              </Link>
              <Link className="nav-link text-white" to="/jogador/eventos">
                Eventos
              </Link>
              <Link className="nav-link text-white" to="/jogador/historico">
                Histórico
              </Link>
              {/* Saldo fictício sempre visível para o jogador */}
              <span className="badge saldo-badge px-3 py-2">
                Saldo: R$ {usuario.saldo.toFixed(2)}
              </span>
            </>
          )}

          {/* Links comuns a todos */}
          <Link className="nav-link text-white" to="/ranking">
            Ranking
          </Link>
          <Link className="nav-link text-white" to="/regulamento">
            Regulamento
          </Link>

          <button className="btn btn-sm btn-outline-light" onClick={handleSair}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
