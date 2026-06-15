import { createContext, useContext, useState, useEffect } from 'react'
import { buscarUsuarioPorLogin, buscarUsuarioPorId } from '../services/api'

// ==========================================================================
// CONTEXT API - CONTEXTO DE AUTENTICAÇÃO (contexts/AuthContext.jsx)
// Ctrl+F: CONTEXT-AUTH
// --------------------------------------------------------------------------
// O QUE É CONTEXT API?
// É o mecanismo do React para compartilhar dados GLOBAIS entre vários
// componentes SEM precisar passar props manualmente de pai para filho
// (o famoso "prop drilling").
//
// Aqui guardamos o USUÁRIO LOGADO. Qualquer tela pode saber quem está logado,
// qual o perfil (admin/usuario) e qual o saldo fictício, apenas usando o
// hook useAuth().
// ==========================================================================

// 1) Criamos o "objeto de contexto".
const AuthContext = createContext()

// 2) Provider: componente que ENVOLVE a aplicação e fornece os dados.
//    Ctrl+F: CONTEXT-AUTH-PROVIDER
export function AuthProvider({ children }) {
  // Estado que guarda o usuário logado (ou null se ninguém logou).
  // useState é um React Hook que cria uma variável reativa.
  const [usuario, setUsuario] = useState(null)

  // Hook useEffect: executa quando o componente é montado.
  // Ctrl+F: CONTEXT-AUTH-PERSISTENCIA
  // Aqui recuperamos o usuário salvo no localStorage para manter o login
  // mesmo se a página for recarregada (F5).
  useEffect(() => {
    const salvo = localStorage.getItem('usuarioLogado')
    if (salvo) {
      setUsuario(JSON.parse(salvo))
    }
  }, [])

  // -----------------------------------------------------------------------
  // login: valida email/senha contra o JSON Server (login simulado).
  // Ctrl+F: CONTEXT-AUTH-LOGIN
  // Retorna o usuário em caso de sucesso ou null em caso de falha.
  // -----------------------------------------------------------------------
  async function login(email, senha) {
    const encontrado = await buscarUsuarioPorLogin(email, senha)
    if (encontrado) {
      setUsuario(encontrado)
      // Salva no navegador para persistir a sessão.
      localStorage.setItem('usuarioLogado', JSON.stringify(encontrado))
    }
    return encontrado
  }

  // -----------------------------------------------------------------------
  // logout: limpa o usuário logado e remove do localStorage.
  // Ctrl+F: CONTEXT-AUTH-LOGOUT
  // -----------------------------------------------------------------------
  function logout() {
    setUsuario(null)
    localStorage.removeItem('usuarioLogado')
  }

  // -----------------------------------------------------------------------
  // atualizarSaldoLocal: sincroniza o saldo do usuário logado depois de
  // uma aposta. Busca o dado mais recente no servidor e atualiza o estado.
  // Ctrl+F: CONTEXT-AUTH-SALDO
  // -----------------------------------------------------------------------
  async function atualizarSaldoLocal() {
    if (!usuario) return
    const atualizado = await buscarUsuarioPorId(usuario.id)
    setUsuario(atualizado)
    localStorage.setItem('usuarioLogado', JSON.stringify(atualizado))
  }

  // 3) Disponibilizamos os dados/funções para toda a árvore de componentes.
  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, atualizarSaldoLocal }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 4) Hook personalizado para consumir o contexto de forma simples.
//    Ctrl+F: CONTEXT-AUTH-HOOK
//    Em qualquer componente basta: const { usuario } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
