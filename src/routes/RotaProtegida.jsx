import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ==========================================================================
// ROTA PROTEGIDA - CONTROLE DE ACESSO (routes/RotaProtegida.jsx)
// Ctrl+F: ROTA-PROTEGIDA
// --------------------------------------------------------------------------
// Componente "guardião". Ele envolve uma página e decide se o usuário pode
// ou não acessá-la, com base em:
//   1) Se está logado;
//   2) Se o perfil dele tem permissão (admin x usuario).
//
// Props:
//   - children:    a página que será exibida se o acesso for permitido.
//   - perfilExigido: (opcional) "admin" ou "usuario". Se informado, somente
//                    esse perfil acessa a rota.
//
// Regras de negócio atendidas:
//   - Usuário comum NÃO acessa funcionalidades administrativas.
//   - Administrador NÃO acessa telas de aposta como jogador.
// ==========================================================================
export default function RotaProtegida({ children, perfilExigido }) {
  const { usuario } = useAuth()

  // 1) Não está logado -> manda para a tela de login.
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  // 2) Está logado, mas o perfil não bate com o exigido -> bloqueia.
  //    Redireciona cada perfil para o seu próprio dashboard.
  if (perfilExigido && usuario.perfil !== perfilExigido) {
    const destino =
      usuario.perfil === 'admin' ? '/admin' : '/jogador'
    return <Navigate to={destino} replace />
  }

  // 3) Acesso liberado -> renderiza a página solicitada.
  return children
}
