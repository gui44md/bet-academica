import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  removerEvento,
  listarApostasPorEvento,
  atualizarAposta,
  buscarUsuarioPorId,
  atualizarSaldoUsuario,
} from "../services/api";

// ==========================================================================
// PÁGINA - GERENCIAR EVENTOS (pages/GerenciarEventos.jsx)
// Ctrl+F: PAGINA-GERENCIAR-EVENTOS
// --------------------------------------------------------------------------
// É a tela mais importante do ADMINISTRADOR. Ela concentra:
//   1) Cadastro de novos eventos;
//   2) Encerramento das apostas de um evento;
//   3) Registro do resultado, que dispara a APURAÇÃO das apostas:
//      - apostas certas -> status "ganhou" + crédito do retorno no saldo;
//      - apostas erradas -> status "perdeu".
//   4) Exclusão de eventos.
// ==========================================================================
export default function GerenciarEventos() {
  const [eventos, setEventos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // Estado do formulário de cadastro de novo evento.
  // Ctrl+F: PAGINA-GERENCIAR-FORM
  const [form, setForm] = useState({
    timeA: "",
    timeB: "",
    esporte: "Futebol",
    data: "",
    oddA: 2.0,
    oddB: 2.0,
  });

  // Carrega a lista de eventos ao abrir a tela.
  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    const lista = await listarEventos();
    setEventos(lista);
  }

  // Atualiza um campo do formulário conforme o admin digita.
  function handleChange(campo, valor) {
    setForm((anterior) => ({ ...anterior, [campo]: valor }));
  }

  // -----------------------------------------------------------------------
  // handleCadastrar: cria um novo evento no JSON Server.
  // Ctrl+F: PAGINA-GERENCIAR-CADASTRAR
  // O evento nasce com status "aberto" e sem resultado.
  // -----------------------------------------------------------------------
  async function handleCadastrar(e) {
    e.preventDefault();

    const novoEvento = {
      ...form,
      oddA: Number(form.oddA),
      oddB: Number(form.oddB),
      status: "aberto",
      resultado: "",
    };

    await criarEvento(novoEvento);
    setMensagem("Evento cadastrado com sucesso!");
    // Limpa o formulário.
    setForm({
      timeA: "",
      timeB: "",
      esporte: "Futebol",
      data: "",
      oddA: 2.0,
      oddB: 2.0,
    });
    carregarEventos();
  }

  // -----------------------------------------------------------------------
  // handleEncerrar: muda o status do evento para "encerrado", impedindo
  // novas apostas. Ainda NÃO define o resultado.
  // Ctrl+F: PAGINA-GERENCIAR-ENCERRAR
  // -----------------------------------------------------------------------
  async function handleEncerrar(evento) {
    await atualizarEvento(evento.id, { status: "encerrado" });
    setMensagem(
      `Apostas do evento "${evento.timeA} x ${evento.timeB}" encerradas.`,
    );
    carregarEventos();
  }

  // -----------------------------------------------------------------------
  // handleRegistrarResultado: define o time vencedor e APURA as apostas.
  // Ctrl+F: PAGINA-GERENCIAR-RESULTADO
  // Esta é a regra de negócio central do sistema:
  //   1) Grava o resultado no evento (e garante status "encerrado").
  //   2) Busca todas as apostas daquele evento.
  //   3) Para cada aposta pendente:
  //        - acertou o palpite -> "ganhou" e credita o retorno no saldo;
  //        - errou             -> "perdeu".
  // -----------------------------------------------------------------------
  async function handleRegistrarResultado(evento, vencedor) {
    // 1) Atualiza o evento com o resultado.
    await atualizarEvento(evento.id, {
      status: "encerrado",
      resultado: vencedor,
    });

    // 2) Pega as apostas vinculadas ao evento.
    const apostas = await listarApostasPorEvento(evento.id);

    // 3) Apura cada aposta ainda pendente.
    for (const aposta of apostas) {
      if (aposta.status !== "pendente") continue; // já apurada, pula

      if (aposta.palpite === vencedor) {
        // Aposta vencedora: marca como "ganhou" e credita o retorno.
        await atualizarAposta(aposta.id, { status: "ganhou" });

        const usuario = await buscarUsuarioPorId(aposta.usuarioId);
        const novoSaldo = usuario.saldo + aposta.retorno;
        await atualizarSaldoUsuario(aposta.usuarioId, novoSaldo);
      } else {
        // Aposta perdedora: apenas marca como "perdeu" (valor já foi debitado
        // no momento da aposta).
        await atualizarAposta(aposta.id, { status: "perdeu" });
      }
    }

    setMensagem(
      `Resultado registrado: ${vencedor} venceu. Apostas apuradas e saldos atualizados.`,
    );
    carregarEventos();
  }

  // -----------------------------------------------------------------------
  // handleRemover: exclui um evento.
  // Ctrl+F: PAGINA-GERENCIAR-REMOVER
  // -----------------------------------------------------------------------
  async function handleRemover(id) {
    await removerEvento(id);
    setMensagem("Evento removido.");
    carregarEventos();
  }

  return (
    <Layout titulo="Gerenciar Eventos">
      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      {/* ---------------- FORMULÁRIO DE CADASTRO ---------------- */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Cadastrar novo evento</h5>
          <form onSubmit={handleCadastrar}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Time A</label>
                <input
                  className="form-control"
                  value={form.timeA}
                  onChange={(e) => handleChange("timeA", e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Time B</label>
                <input
                  className="form-control"
                  value={form.timeB}
                  onChange={(e) => handleChange("timeB", e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Esporte</label>
                <select
                  className="form-select"
                  value={form.esporte}
                  onChange={(e) => handleChange("esporte", e.target.value)}
                >
                  <option>Futebol</option>
                  <option>Basquete</option>
                  <option>Vôlei</option>
                  <option>Tênis</option>
                  <option>Counter-Strike</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Odd {form.timeA || "A"}</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  className="form-control"
                  value={form.oddA}
                  onChange={(e) => handleChange("oddA", e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Odd {form.timeB || "B"}</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  className="form-control"
                  value={form.oddB}
                  onChange={(e) => handleChange("oddB", e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3">
              Cadastrar evento
            </button>
          </form>
        </div>
      </div>

      {/* ---------------- LISTA DE EVENTOS ---------------- */}
      {/* Ctrl+F: PAGINA-GERENCIAR-LISTA */}
      <h5 className="mb-3">Eventos cadastrados</h5>
      <div className="table-responsive">
        <table className="table table-bordered align-middle bg-white">
          <thead className="table-dark">
            <tr>
              <th>Confronto</th>
              <th>Esporte</th>
              <th>Data</th>
              <th>Status</th>
              <th>Resultado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((ev) => (
              <tr key={ev.id}>
                <td>
                  {ev.timeA} x {ev.timeB}
                </td>
                <td>{ev.esporte}</td>
                <td>{ev.data}</td>
                <td>
                  <span
                    className={
                      ev.status === "aberto"
                        ? "status-aberto"
                        : "status-encerrado"
                    }
                  >
                    {ev.status}
                  </span>
                </td>
                <td>{ev.resultado || "—"}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    {/* Encerrar apostas (apenas se estiver aberto) */}
                    {ev.status === "aberto" && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEncerrar(ev)}
                      >
                        Encerrar apostas
                      </button>
                    )}

                    {/* Registrar resultado (apenas se ainda não tem) */}
                    {!ev.resultado && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleRegistrarResultado(ev, ev.timeA)}
                        >
                          Venceu {ev.timeA}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleRegistrarResultado(ev, ev.timeB)}
                        >
                          Venceu {ev.timeB}
                        </button>
                      </>
                    )}

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemover(ev.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
