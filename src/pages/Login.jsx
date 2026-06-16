import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ==========================================================================
// PÁGINA - LOGIN SIMULADO (pages/Login.jsx)
// Ctrl+F: PAGINA-LOGIN
// --------------------------------------------------------------------------
// Tela inicial. Faz o login simulado validando email/senha contra o
// JSON Server (através do AuthContext) e redireciona conforme o PERFIL:
//   - admin   -> /admin
//   - usuario -> /jogador
// ==========================================================================
export default function Login() {
  // useState (React Hook): controla os campos do formulário e a mensagem de erro.
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login } = useAuth() // função de login vinda do Context API
  const navigate = useNavigate()

  // -----------------------------------------------------------------------
  // handleLogin: dispara a validação do login.
  // Ctrl+F: PAGINA-LOGIN-SUBMIT
  // -----------------------------------------------------------------------
  async function handleLogin(e) {
    e.preventDefault() // evita o recarregamento padrão do formulário
    setErro('')
    setCarregando(true)

    try {
      const usuario = await login(email, senha)
      if (!usuario) {
        setErro('Email ou senha inválidos.')
        return
      }
      // Redireciona de acordo com o perfil retornado.
      if (usuario.perfil === 'admin') {
        navigate('/admin')
      } else {
        navigate('/jogador')
      }
    } catch {
      setErro('Não foi possível conectar. O JSON Server está rodando?')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <div className="card shadow">
        <div className="card-body p-4">
          <h3 className="text-center mb-1">⚽ Bet Acadêmica</h3>
          <p className="text-center aviso-academico mb-4">
            Plataforma de apostas fictícias — uso acadêmico
          </p>

          {/* Mensagem de erro (se houver) */}
          {erro && <div className="alert alert-danger py-2">{erro}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bet.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="123"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Dica de usuários de teste para facilitar a apresentação */}
          <hr />
          <small className="text-muted d-block">joao
            <strong>Teste:</strong> admin@bet.com / guilheme@bet.com / michel@bet.com — senha: 123
          </small>
        </div>
      </div>
    </div>
  )
}
