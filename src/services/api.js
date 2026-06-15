// ==========================================================================
// CAMADA DE SERVIÇOS - CONSUMO DA API (services/api.js)
// Ctrl+F: SERVICO-API
// --------------------------------------------------------------------------
// Centraliza TODA a comunicação com o JSON Server (a API fake).
// Em vez de espalhar "fetch" pelas telas, concentramos tudo aqui.
// Isso deixa o código organizado e reutilizável.
//
// Usamos a API "fetch" (nativa do navegador) para fazer as requisições HTTP:
//   GET    -> buscar dados
//   POST   -> criar um novo registro
//   PUT    -> atualizar um registro inteiro
//   PATCH  -> atualizar apenas alguns campos de um registro
// ==========================================================================

// Endereço base onde o JSON Server está rodando (npm run server -> porta 3001)
const URL_BASE = "http://localhost:3001";

// --------------------------------------------------------------------------
// Função auxiliar genérica de requisição.
// Ctrl+F: SERVICO-REQUISICAO
// Trata o retorno em JSON e lança erro caso a resposta não seja "ok".
// --------------------------------------------------------------------------
async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

// ===================== USUÁRIOS =====================
// Ctrl+F: SERVICO-USUARIOS

// Busca um usuário pelo email e senha (usado no login simulado).
// O JSON Server permite filtrar por query string: ?email=...&senha=...
export async function buscarUsuarioPorLogin(email, senha) {
  const lista = await requisicao(
    `/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`,
  );
  // Retorna o primeiro usuário encontrado ou null se a lista vier vazia.
  return lista.length > 0 ? lista[0] : null;
}

// Busca um usuário pelo id (usado para atualizar saldo no contexto).
export async function buscarUsuarioPorId(id) {
  return requisicao(`/usuarios/${id}`);
}

// Lista todos os usuários (usado no ranking - funcionalidade extra).
export async function listarUsuarios() {
  return requisicao("/usuarios");
}

// Atualiza apenas o saldo de um usuário (PATCH = atualização parcial).
export async function atualizarSaldoUsuario(id, novoSaldo) {
  return requisicao(`/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ saldo: novoSaldo }),
  });
}

// ===================== EVENTOS =====================
// Ctrl+F: SERVICO-EVENTOS

export async function listarEventos() {
  return requisicao("/eventos");
}

export async function buscarEventoPorId(id) {
  return requisicao(`/eventos/${id}`);
}

// Cria um novo evento (cadastro feito pelo administrador).
export async function criarEvento(evento) {
  return requisicao("/eventos", {
    method: "POST",
    body: JSON.stringify(evento),
  });
}

// Atualiza um evento (ex.: encerrar apostas, registrar resultado).
export async function atualizarEvento(id, dados) {
  return requisicao(`/eventos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

// Remove um evento (gerenciamento pelo admin).
export async function removerEvento(id) {
  return requisicao(`/eventos/${id}`, { method: "DELETE" });
}

// ===================== APOSTAS =====================
// Ctrl+F: SERVICO-APOSTAS

export async function listarApostas() {
  return requisicao("/apostas");
}

// Lista as apostas de um usuário específico (histórico do jogador).
export async function listarApostasPorUsuario(usuarioId) {
  return requisicao(`/apostas?usuarioId=${usuarioId}`);
}

// Lista as apostas vinculadas a um evento (usado ao registrar o resultado).
export async function listarApostasPorEvento(eventoId) {
  return requisicao(`/apostas?eventoId=${eventoId}`);
}

// Cria uma nova aposta fictícia.
export async function criarAposta(aposta) {
  return requisicao("/apostas", {
    method: "POST",
    body: JSON.stringify(aposta),
  });
}

// Atualiza o status/retorno de uma aposta (após o resultado do evento).
export async function atualizarAposta(id, dados) {
  return requisicao(`/apostas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}
