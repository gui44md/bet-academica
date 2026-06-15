// ==========================================================================
// COMPONENTE REUTILIZÁVEL - CARTÃO DE EVENTO (components/CardEvento.jsx)
// Ctrl+F: COMPONENTE-CARDEVENTO
// --------------------------------------------------------------------------
// Mostra os dados de um evento esportivo em formato de "card".
// É reutilizado na tela de Eventos Disponíveis (jogador) e pode ser
// aproveitado em outras listagens.
//
// Props (dados recebidos do componente pai):
//   - evento: objeto com os dados do evento (times, esporte, odds, status...)
//   - onApostar: função chamada ao clicar em "Apostar" (opcional)
// ==========================================================================
export default function CardEvento({ evento, onApostar }) {
  const aberto = evento.status === "aberto";

  return (
    <div className="card card-evento shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        {/* Esporte e data */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-secondary">{evento.esporte}</span>
          <small className="text-muted">{evento.data}</small>
        </div>

        {/* Confronto */}
        <h5 className="card-title text-center my-2">
          {evento.timeA} <span className="text-muted">x</span> {evento.timeB}
        </h5>

        {/* Odds (multiplicadores fictícios) */}
        <div className="d-flex justify-content-around mb-3">
          <small>
            {evento.timeA}: <strong>{evento.oddA}</strong>
          </small>
          <small>
            {evento.timeB}: <strong>{evento.oddB}</strong>
          </small>
        </div>

        {/* Status do evento */}
        <p className="mb-2">
          Status:{" "}
          <span className={aberto ? "status-aberto" : "status-encerrado"}>
            {evento.status}
          </span>
        </p>

        {/* Se já tem resultado, exibe (apenas eventos encerrados) */}
        {evento.resultado && (
          <p className="mb-2">
            Resultado: <strong>{evento.resultado}</strong>
          </p>
        )}

        {/* Botão de apostar: só aparece se a função foi passada e o evento
            estiver aberto. Em evento encerrado, fica desabilitado. */}
        {onApostar && (
          <button
            className="btn btn-success mt-auto"
            disabled={!aberto}
            onClick={() => onApostar(evento)}
          >
            {aberto ? "Apostar" : "Apostas encerradas"}
          </button>
        )}
      </div>
    </div>
  );
}
