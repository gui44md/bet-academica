import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { listarApostasPorUsuario } from '../services/api'

// ==========================================================================
// PÁGINA - DASHBOARD DO JOGADOR (pages/DashboardJogador.jsx)
// Ctrl+F: PAGINA-DASH-JOGADOR
// --------------------------------------------------------------------------
// Área de resumo do jogador. Mostra o saldo fictício atual e um pequeno
// resumo das apostas (quantas ganhou, perdeu e estão pendentes).
// ==========================================================================
export default function DashboardJogador() {
  const { usuario } = useAuth() // usuário logado (Context API)

  const [resumo, setResumo] = useState({
    total: 0,
    ganhou: 0,
    perdeu: 0,
    pendente: 0,
  })

  // Busca as apostas do jogador ao abrir a tela.
  useEffect(() => {
    async function carregar() {
      const apostas = await listarApostasPorUsuario(usuario.id)
      setResumo({
        total: apostas.length,
        ganhou: apostas.filter((a) => a.status === 'ganhou').length,
        perdeu: apostas.filter((a) => a.status === 'perdeu').length,
        pendente: apostas.filter((a) => a.status === 'pendente').length,
      })
    }
    carregar()
  }, [usuario.id])

  return (
    <Layout titulo={`Olá, ${usuario.nome}!`}>
      {/* Destaque do saldo fictício */}
      <div className="card text-bg-success shadow-sm mb-4">
        <div className="card-body text-center">
          <h6 className="mb-1">Seu saldo fictício</h6>
          <h1 className="mb-0">R$ {usuario.saldo.toFixed(2)}</h1>
        </div>
      </div>

      {/* Resumo das apostas */}
      <div className="row g-3 mb-4">
        <CardMini titulo="Total de apostas" valor={resumo.total} cor="primary" />
        <CardMini titulo="Ganhas" valor={resumo.ganhou} cor="success" />
        <CardMini titulo="Perdidas" valor={resumo.perdeu} cor="danger" />
        <CardMini titulo="Pendentes" valor={resumo.pendente} cor="warning" />
      </div>

      <div className="d-flex gap-2 flex-wrap">
        <Link to="/jogador/eventos" className="btn btn-success">
          Ver eventos disponíveis
        </Link>
        <Link to="/jogador/historico" className="btn btn-outline-success">
          Meu histórico
        </Link>
      </div>
    </Layout>
  )
}

// Subcomponente reutilizável de cartão pequeno.
// Ctrl+F: PAGINA-DASH-JOGADOR-CARD
function CardMini({ titulo, valor, cor }) {
  return (
    <div className="col-6 col-md-3">
      <div className={`card text-bg-${cor} text-center shadow-sm`}>
        <div className="card-body">
          <h3 className="mb-0">{valor}</h3>
          <small>{titulo}</small>
        </div>
      </div>
    </div>
  )
}