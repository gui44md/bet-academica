import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { listarApostasPorUsuario, listarEventos } from '../services/api'

// ==========================================================================
// PÁGINA - HISTÓRICO DE APOSTAS (pages/HistoricoApostas.jsx)
// Ctrl+F: PAGINA-HISTORICO
// --------------------------------------------------------------------------
// Lista todas as apostas do jogador logado, com o confronto, palpite, valor,
// status (pendente/ganhou/perdeu) e retorno. Cruza a aposta com o evento
// para exibir o nome dos times.
// ==========================================================================
export default function HistoricoApostas() {
  const { usuario } = useAuth()
  const [apostas, setApostas] = useState([])
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    async function carregar() {
      // Busca em paralelo as apostas do usuário e todos os eventos.
      const [minhasApostas, todosEventos] = await Promise.all([
        listarApostasPorUsuario(usuario.id),
        listarEventos(),
      ])
      setApostas(minhasApostas)
      setEventos(todosEventos)
    }
    carregar()
  }, [usuario.id])

  // Função auxiliar: dado o id do evento, devolve o texto do confronto.
  // Ctrl+F: PAGINA-HISTORICO-EVENTO
  function nomeEvento(eventoId) {
    const ev = eventos.find((e) => e.id === eventoId)
    return ev ? `${ev.timeA} x ${ev.timeB}` : 'Evento removido'
  }

  // Retorna a classe CSS de cor conforme o status da aposta.
  function classeStatus(status) {
    if (status === 'ganhou') return 'status-ganhou'
    if (status === 'perdeu') return 'status-perdeu'
    return 'status-pendente'
  }

  return (
    <Layout titulo="Meu Histórico de Apostas">
      {apostas.length === 0 ? (
        <p>Você ainda não realizou nenhuma aposta.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped bg-white align-middle">
            <thead className="table-dark">
              <tr>
                <th>Evento</th>
                <th>Palpite</th>
                <th>Valor</th>
                <th>Odd</th>
                <th>Status</th>
                <th>Retorno</th>
              </tr>
            </thead>
            <tbody>
              {apostas.map((ap) => (
                <tr key={ap.id}>
                  <td>{nomeEvento(ap.eventoId)}</td>
                  <td>{ap.palpite}</td>
                  <td>R$ {ap.valor.toFixed(2)}</td>
                  <td>{ap.odd}</td>
                  <td>
                    <span className={classeStatus(ap.status)}>{ap.status}</span>
                  </td>
                  <td>
                    {/* Só mostra retorno se ganhou; senão, traço. */}
                    {ap.status === 'ganhou'
                      ? `R$ ${ap.retorno.toFixed(2)}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
