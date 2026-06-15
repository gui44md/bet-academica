import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { listarEventos, listarApostas, listarUsuarios } from "../services/api";

// ==========================================================================
// PÁGINA - DASHBOARD DO ADMINISTRADOR (pages/DashboardAdmin.jsx)
// Ctrl+F: PAGINA-DASH-ADMIN
// --------------------------------------------------------------------------
// Área de resumo do administrador. Mostra indicadores gerais do sistema:
//   - total de eventos (e quantos estão abertos/encerrados)
//   - total de apostas realizadas
//   - total de jogadores cadastrados
// Tudo consumido do JSON Server.
// ==========================================================================
export default function DashboardAdmin() {
  // Estado com os números do painel.
  const [resumo, setResumo] = useState({
    eventos: 0,
    abertos: 0,
    encerrados: 0,
    apostas: 0,
    jogadores: 0,
  });
  const [carregando, setCarregando] = useState(true);

  // useEffect: busca os dados assim que a tela é aberta.
  // Ctrl+F: PAGINA-DASH-ADMIN-EFFECT
  useEffect(() => {
    async function carregar() {
      // Promise.all faz as 3 requisições em paralelo (mais rápido).
      const [eventos, apostas, usuarios] = await Promise.all([
        listarEventos(),
        listarApostas(),
        listarUsuarios(),
      ]);

      setResumo({
        eventos: eventos.length,
        abertos: eventos.filter((ev) => ev.status === "aberto").length,
        encerrados: eventos.filter((ev) => ev.status === "encerrado").length,
        apostas: apostas.length,
        // Conta apenas usuários com perfil de jogador.
        jogadores: usuarios.filter((u) => u.perfil === "usuario").length,
      });
      setCarregando(false);
    }
    carregar();
  }, []);

  return (
    <Layout titulo="Painel do Administrador">
      {carregando ? (
        <p>Carregando indicadores...</p>
      ) : (
        <>
          {/* Cartões de resumo (responsivos via grid do Bootstrap) */}
          <div className="row g-3 mb-4">
            <CardResumo titulo="Eventos" valor={resumo.eventos} cor="primary" />
            <CardResumo titulo="Abertos" valor={resumo.abertos} cor="success" />
            <CardResumo
              titulo="Encerrados"
              valor={resumo.encerrados}
              cor="danger"
            />
            <CardResumo titulo="Apostas" valor={resumo.apostas} cor="info" />
            <CardResumo
              titulo="Jogadores"
              valor={resumo.jogadores}
              cor="warning"
            />
          </div>

          <Link to="/admin/eventos" className="btn btn-success">
            Gerenciar Eventos
          </Link>
        </>
      )}
    </Layout>
  );
}

// --------------------------------------------------------------------------
// Subcomponente reutilizável para cada cartão numérico do painel.
// Ctrl+F: PAGINA-DASH-ADMIN-CARD
// --------------------------------------------------------------------------
function CardResumo({ titulo, valor, cor }) {
  return (
    <div className="col-6 col-md-4 col-lg">
      <div className={`card text-bg-${cor} text-center shadow-sm`}>
        <div className="card-body">
          <h2 className="mb-0">{valor}</h2>
          <small>{titulo}</small>
        </div>
      </div>
    </div>
  );
}
