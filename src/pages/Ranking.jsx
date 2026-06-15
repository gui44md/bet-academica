import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { listarUsuarios, listarApostas } from "../services/api";

// ==========================================================================
// PÁGINA - RANKING DOS JOGADORES (pages/Ranking.jsx)
// Ctrl+F: PAGINA-RANKING
// --------------------------------------------------------------------------
// >>> FUNCIONALIDADE EXTRA OBRIGATÓRIA DO TRABALHO <<<
//
// Monta um ranking dos jogadores combinando dois dados do JSON Server:
//   - o SALDO fictício atual de cada jogador;
//   - o total já GANHO em apostas vencedoras.
// O critério de ordenação é a "pontuação" = saldo + total ganho, do maior
// para o menor. O 1º colocado recebe destaque visual.
//
// Por que conta como funcionalidade extra (conforme o enunciado):
//   - tem tela própria (esta);
//   - consome dados do JSON Server (usuários + apostas);
//   - tem relação direta com o tema do sistema;
//   - está documentada no README e será apresentada pela dupla.
// ==========================================================================
export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function montarRanking() {
      // Busca jogadores e apostas em paralelo.
      const [usuarios, apostas] = await Promise.all([
        listarUsuarios(),
        listarApostas(),
      ]);

      // Considera apenas usuários com perfil "usuario" (jogadores).
      const jogadores = usuarios.filter((u) => u.perfil === "usuario");

      // Para cada jogador, calcula o total ganho somando o retorno das
      // apostas com status "ganhou".
      // Ctrl+F: PAGINA-RANKING-CALCULO
      const lista = jogadores.map((jogador) => {
        const apostasDoJogador = apostas.filter(
          (a) => a.usuarioId === jogador.id,
        );
        const totalGanho = apostasDoJogador
          .filter((a) => a.status === "ganhou")
          .reduce((soma, a) => soma + a.retorno, 0);

        const vitorias = apostasDoJogador.filter(
          (a) => a.status === "ganhou",
        ).length;

        return {
          id: jogador.id,
          nome: jogador.nome,
          saldo: jogador.saldo,
          totalGanho,
          vitorias,
          // Pontuação usada para ordenar o ranking.
          pontuacao: jogador.saldo + totalGanho,
        };
      });

      // Ordena do maior para o menor pela pontuação.
      lista.sort((a, b) => b.pontuacao - a.pontuacao);

      setRanking(lista);
      setCarregando(false);
    }
    montarRanking();
  }, []);

  return (
    <Layout titulo="🏆 Ranking dos Jogadores">
      <p className="text-muted">
        Classificação por pontuação (saldo fictício + total ganho em apostas).
      </p>

      {carregando ? (
        <p>Calculando ranking...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered bg-white align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Saldo</th>
                <th>Total ganho</th>
                <th>Vitórias</th>
                <th>Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((jog, indice) => (
                <tr
                  key={jog.id}
                  // Destaca o líder (1ª posição) com uma classe especial.
                  className={indice === 0 ? "ranking-lider" : ""}
                >
                  <td>
                    {indice === 0
                      ? "🥇"
                      : indice === 1
                        ? "🥈"
                        : indice === 2
                          ? "🥉"
                          : indice + 1}
                  </td>
                  <td>{jog.nome}</td>
                  <td>R$ {jog.saldo.toFixed(2)}</td>
                  <td>R$ {jog.totalGanho.toFixed(2)}</td>
                  <td>{jog.vitorias}</td>
                  <td>
                    <strong>R$ {jog.pontuacao.toFixed(2)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
