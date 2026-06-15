import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CardEvento from '../components/CardEvento'
import { listarEventos } from '../services/api'

// ==========================================================================
// PÁGINA - EVENTOS DISPONÍVEIS (pages/EventosDisponiveis.jsx)
// Ctrl+F: PAGINA-EVENTOS-DISPONIVEIS
// --------------------------------------------------------------------------
// Lista os eventos para o jogador apostar. Inclui um FILTRO POR ESPORTE,
// que ajuda o jogador a encontrar eventos do esporte desejado.
// Ao clicar em "Apostar", navega para a tela de aposta daquele evento.
// ==========================================================================
export default function EventosDisponiveis() {
  const [eventos, setEventos] = useState([])
  const [filtro, setFiltro] = useState('Todos') // esporte selecionado
  const navigate = useNavigate()

  useEffect(() => {
    async function carregar() {
      const lista = await listarEventos()
      setEventos(lista)
    }
    carregar()
  }, [])

  // Monta a lista de esportes únicos para o seletor de filtro.
  // Ctrl+F: PAGINA-EVENTOS-FILTRO
  const esportes = ['Todos', ...new Set(eventos.map((ev) => ev.esporte))]

  // Aplica o filtro: se "Todos", mostra tudo; senão, só o esporte escolhido.
  const eventosFiltrados =
    filtro === 'Todos'
      ? eventos
      : eventos.filter((ev) => ev.esporte === filtro)

  // Ao apostar, leva para a rota /jogador/apostar/:eventoId
  function irParaAposta(evento) {
    navigate(`/jogador/apostar/${evento.id}`)
  }

  return (
    <Layout titulo="Eventos Disponíveis">
      {/* Botões de filtro por esporte */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {esportes.map((esp) => (
          <button
            key={esp}
            className={`btn btn-sm ${
              filtro === esp ? 'btn-success' : 'btn-outline-secondary'
            }`}
            onClick={() => setFiltro(esp)}
          >
            {esp}
          </button>
        ))}
      </div>

      {/* Grade de cards de eventos (responsiva) */}
      <div className="row g-3">
        {eventosFiltrados.length === 0 && (
          <p>Nenhum evento encontrado para este filtro.</p>
        )}
        {eventosFiltrados.map((ev) => (
          <div className="col-12 col-md-6 col-lg-4" key={ev.id}>
            <CardEvento evento={ev} onApostar={irParaAposta} />
          </div>
        ))}
      </div>
    </Layout>
  )
}
