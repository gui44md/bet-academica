import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes/AppRoutes'

// ==========================================================================
// COMPONENTE RAIZ (App.jsx)
// Ctrl+F: APP-RAIZ
// --------------------------------------------------------------------------
// Envolve toda a aplicação com o AuthProvider (Context API), de modo que
// QUALQUER página/componente consiga acessar o usuário logado.
// Dentro dele renderizamos as rotas (AppRoutes).
// ==========================================================================
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
