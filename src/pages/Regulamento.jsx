import Layout from "../components/Layout";

// ==========================================================================
// PÁGINA - REGULAMENTO (pages/Regulamento.jsx)
// Ctrl+F: PAGINA-REGULAMENTO
// --------------------------------------------------------------------------
// Página estática que descreve as regras da plataforma e reforça a
// finalidade puramente acadêmica do sistema. Acessível a qualquer usuário
// logado (admin ou jogador).
// ==========================================================================
export default function Regulamento() {
  return (
    <Layout titulo="📋 Regulamento da Plataforma">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5>1. Finalidade</h5>
          <p>
            A Bet Acadêmica é um sistema fictício desenvolvido para fins
            exclusivamente acadêmicos. Não envolve dinheiro real, PIX, cartão,
            criptomoedas ou qualquer integração com sites reais de apostas.
          </p>

          <h5>2. Saldo fictício</h5>
          <p>
            Cada jogador inicia com um saldo fictício. Esse valor é usado apenas
            para simular apostas e não possui qualquer valor monetário real.
          </p>

          <h5>3. Apostas</h5>
          <p>
            O jogador escolhe um evento aberto, seleciona um time e define um
            valor (menor ou igual ao seu saldo). O valor é debitado na hora e a
            aposta fica com status <em>pendente</em> até o administrador
            registrar o resultado.
          </p>

          <h5>4. Apuração de resultados</h5>
          <p>
            Quando o administrador informa o vencedor de um evento, as apostas
            são apuradas automaticamente: apostas certas passam para{" "}
            <em>ganhou</em> e creditam o retorno (valor × odd); apostas erradas
            passam para <em>perdeu</em>.
          </p>

          <h5>5. Perfis</h5>
          <p>
            O administrador gerencia eventos e resultados, mas não realiza
            apostas. O jogador realiza apostas, mas não acessa funções
            administrativas.
          </p>

          <h5>6. Ranking</h5>
          <p>
            Os jogadores são classificados por pontuação (saldo fictício + total
            ganho em apostas), incentivando a participação de forma lúdica.
          </p>
        </div>
      </div>
    </Layout>
  );
}
