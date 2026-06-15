import Navbar from "./Navbar";

// ==========================================================================
// COMPONENTE REUTILIZÁVEL - CONTÊINER DE PÁGINA (components/Layout.jsx)
// Ctrl+F: COMPONENTE-LAYOUT
// --------------------------------------------------------------------------
// Estrutura padrão das telas internas: Navbar no topo + conteúdo centralizado
// dentro de um "container" do Bootstrap. Evita repetir esse esqueleto em
// todas as páginas (reuso de componentes).
//
// Props:
//   - titulo:   título exibido no topo da página (opcional)
//   - children: conteúdo da página
// ==========================================================================
export default function Layout({ titulo, children }) {
  return (
    <>
      <Navbar />
      <div className="container pb-5">
        {titulo && <h2 className="mb-4">{titulo}</h2>}
        {children}
        {/* Aviso fixo reforçando a finalidade acadêmica do sistema */}
        <p className="aviso-academico mt-5 text-center">
          Sistema de uso exclusivamente acadêmico. Todos os valores, saldos e
          apostas são fictícios e servem apenas para simulação.
        </p>
      </div>
    </>
  );
}
