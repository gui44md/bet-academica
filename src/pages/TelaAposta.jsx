import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import {
  buscarEventoPorId,
  criarAposta,
  atualizarSaldoUsuario,
} from '../services/api'

// ==========================================================================
// PÁGINA - TELA DE APOSTA (pages/TelaAposta.jsx)
// Ctrl+F: PAGINA-TELA-APOSTA
// --------------------------------------------------------------------------
// Onde o jogador efetua uma aposta fictícia em um evento específico.
// Regras de negócio aplicadas aqui:
//   - só é possível apostar em evento "aberto";
//   - o valor apostado precisa ser > 0 e <= saldo disponível;
//   - ao confirmar:
//       * cria a aposta com status "pendente" e o retorno calculado
//         (valor x odd do palpite escolhido);
//       * debita o valor do saldo fictício do jogador;
//       * sincroniza o saldo no Context API.
// ==========================================================================
export default function TelaAposta() {
  // useParams: lê o :eventoId presente na URL da rota.
  const { eventoId } = useParams()
  const navigate = useNavigate()
  const { usuario, atualizarSaldoLocal } = useAuth()

  const [evento, setEvento] = useState(null)
  const [palpite, setPalpite] = useState('') // time escolhido pelo jogador
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // Carrega os dados do evento informado na URL.
  useEffect(() => {
    async function carregar() {
      const ev = await buscarEventoPorId(eventoId)
      setEvento(ev)
    }
    carregar()
  }, [eventoId])

  // Enquanto não carregou, mostra aviso.
  if (!evento) {
    return (
      <Layout titulo="Tela de Aposta">
        <p>Carregando evento...</p>
      </Layout>
    )
  }

  // Descobre a odd do palpite escolhido para calcular o retorno.
  // Ctrl+F: PAGINA-TELA-APOSTA-ODD
  const oddEscolhida =
    palpite === evento.timeA
      ? evento.oddA
      : palpite === evento.timeB
      ? evento.oddB
      : 0

  // Retorno potencial = valor apostado x odd (apenas exibição prévia).
  const retornoPotencial = valor ? (Number(valor) * oddEscolhida).toFixed(2) : '0.00'

  // -----------------------------------------------------------------------
  // handleConfirmar: valida e registra a aposta.
  // Ctrl+F: PAGINA-TELA-APOSTA-CONFIRMAR
  // -----------------------------------------------------------------------
  async function handleConfirmar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    const valorNumerico = Number(valor)

    // Validações básicas (regras de negócio).
    if (evento.status !== 'aberto') {
      setErro('Este evento não está mais aceitando apostas.')
      return
    }
    if (!palpite) {
      setErro('Escolha em qual time deseja apostar.')
      return
    }
    if (valorNumerico <= 0) {
      setErro('Informe um valor de aposta maior que zero.')
      return
    }
    if (valorNumerico > usuario.saldo) {
      setErro('Saldo fictício insuficiente para esta aposta.')
      return
    }

    // Monta a aposta a ser salva no JSON Server.
    const novaAposta = {
      usuarioId: usuario.id,
      eventoId: evento.id,
      palpite,
      valor: valorNumerico,
      odd: oddEscolhida,
      status: 'pendente',
      // Retorno que o jogador receberá se ganhar.
      retorno: Number((valorNumerico * oddEscolhida).toFixed(2)),
    }

    // 1) Cria a aposta.
    await criarAposta(novaAposta)

    // 2) Debita o valor do saldo do jogador.
    const novoSaldo = usuario.saldo - valorNumerico
    await atualizarSaldoUsuario(usuario.id, novoSaldo)

    // 3) Sincroniza o saldo no Context (para a navbar atualizar na hora).
    await atualizarSaldoLocal()

    setSucesso('Aposta registrada com sucesso! Redirecionando...')
    // Após 1,2s volta para a lista de eventos.
    setTimeout(() => navigate('/jogador/eventos'), 1200)
  }

  return (
    <Layout titulo="Fazer Aposta">
      <div className="card shadow-sm" style={{ maxWidth: 560 }}>
        <div className="card-body">
          <h5>
            {evento.timeA} x {evento.timeB}
          </h5>
          <p className="text-muted mb-3">
            {evento.esporte} — {evento.data}
          </p>

          {erro && <div className="alert alert-danger py-2">{erro}</div>}
          {sucesso && <div className="alert alert-success py-2">{sucesso}</div>}

          <form onSubmit={handleConfirmar}>
            {/* Escolha do palpite */}
            <label className="form-label">Escolha o vencedor:</label>
            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                className={`btn flex-fill ${
                  palpite === evento.timeA
                    ? 'btn-success'
                    : 'btn-outline-success'
                }`}
                onClick={() => setPalpite(evento.timeA)}
              >
                {evento.timeA} ({evento.oddA})
              </button>
              <button
                type="button"
                className={`btn flex-fill ${
                  palpite === evento.timeB
                    ? 'btn-success'
                    : 'btn-outline-success'
                }`}
                onClick={() => setPalpite(evento.timeB)}
              >
                {evento.timeB} ({evento.oddB})
              </button>
            </div>

            {/* Valor da aposta */}
            <label className="form-label">Valor (fictício):</label>
            <input
              type="number"
              className="form-control mb-2"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min="1"
              placeholder="Ex.: 100"
            />

            <p className="mb-3">
              Saldo disponível: <strong>R$ {usuario.saldo.toFixed(2)}</strong>
              <br />
              Retorno potencial:{' '}
              <strong className="text-success">R$ {retornoPotencial}</strong>
            </p>

            <button type="submit" className="btn btn-success w-100">
              Confirmar aposta
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
