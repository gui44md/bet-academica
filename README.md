# Bet Acadêmica

Plataforma **fictícia** de apostas esportivas desenvolvida em React para fins **exclusivamente acadêmicos**. Nenhum valor é real: todos os saldos, apostas, prêmios e movimentações servem apenas para simulação.

---

## Integrantes

- **Guilherme** — [https://github.com/gui44md]
- **Michel José Freitas Farah** — [https://github.com/mchfarah]

---

## Descrição geral do sistema

A Bet Acadêmica simula uma plataforma de apostas com **dois perfis**:

- **Administrador:** cadastra e gerencia eventos esportivos, encerra apostas, registra resultados e acompanha indicadores gerais.
- **Usuário/Jogador:** visualiza os eventos disponíveis, realiza apostas fictícias, acompanha o saldo simulado, consulta o histórico e o ranking.

Os dados são consumidos de uma **API simulada com JSON Server**.

---

## Funcionalidade extra escolhida

**Ranking dos Jogadores.** Tela própria (`/ranking`) que classifica os jogadores por **pontuação = saldo fictício + total ganho em apostas**, lendo os dados de `usuarios` e `apostas` no JSON Server. O 1º colocado recebe destaque visual. A regra está implementada em `src/pages/Ranking.jsx` (Ctrl+F: `PAGINA-RANKING`).

---

## Regras de negócio

- Login simulado validando email/senha contra o JSON Server.
- Controle de acesso por perfil: usuário comum **não** acessa telas administrativas; administrador **não** realiza apostas.
- Só é possível apostar em evento com status `aberto`.
- O valor da aposta precisa ser maior que zero e menor ou igual ao saldo.
- Ao apostar, o valor é **debitado na hora** e a aposta nasce `pendente`.
- Ao registrar o resultado, as apostas são apuradas automaticamente: certas viram `ganhou` (creditam `valor × odd` no saldo); erradas viram `perdeu`.

---

## Tecnologias utilizadas

- React + Vite
- React Router DOM (rotas e rotas protegidas)
- React Hooks (`useState`, `useEffect`, `useParams`, `useNavigate`, `useContext`)
- Context API (estado global de autenticação)
- JSON Server (API fake)
- Fetch (consumo da API)
- Bootstrap (estilização e responsividade)
- GitHub

---

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar o JSON Server (API fake) — porta 3001

```bash
npm run server
```

### 3. Em outro terminal, rodar o React — porta 5173

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## Usuários de teste

| Perfil  | Email             | Senha | Saldo |
| ------- | ----------------- | ----- | ----- |
| Admin   | admin@bet.com     | 123   | —     |
| Jogador | michel@bet.com    | 123   | 1000  |
| Jogador | guilherme@bet.com | 123   | 1500  |

---

## 🗺️ Principais rotas

| Rota                         | Perfil  | Descrição                        |
| ---------------------------- | ------- | -------------------------------- |
| `/`                          | público | Login                            |
| `/admin`                     | admin   | Dashboard do administrador       |
| `/admin/eventos`             | admin   | Cadastro/gestão de eventos       |
| `/jogador`                   | usuario | Dashboard do jogador             |
| `/jogador/eventos`           | usuario | Eventos disponíveis (com filtro) |
| `/jogador/apostar/:eventoId` | usuario | Tela de aposta                   |
| `/jogador/historico`         | usuario | Histórico de apostas             |
| `/ranking`                   | ambos   | Ranking (funcionalidade extra)   |
| `/regulamento`               | ambos   | Regras da plataforma             |

---

## Divisão de tarefas

**Guilherme**

- Estrutura inicial (Vite, pastas, Bootstrap), Context API e autenticação.
- Rotas, rotas protegidas e controle de acesso por perfil.
- Telas do jogador: dashboard, eventos disponíveis (filtro), tela de aposta, histórico.

**Michel**

- Configuração do JSON Server e camada de serviços (`services/api.js`).
- Telas do administrador: dashboard e gestão de eventos (encerrar, resultado, apuração).
- Funcionalidade extra (Ranking), regulamento e componentes reutilizáveis (Navbar, CardEvento, Layout).

---

## Principais telas

- **Login:** acesso simulado com diferenciação de perfil.
- **Dashboard Admin:** indicadores (eventos, apostas, jogadores).
- **Gerenciar Eventos:** cadastro, encerramento e registro de resultado.
- **Dashboard Jogador:** saldo e resumo das apostas.
- **Eventos Disponíveis:** lista filtrável por esporte.
- **Tela de Aposta:** escolha de time, valor e retorno potencial.
- **Histórico:** todas as apostas do jogador com status.
- **Ranking:** classificação dos jogadores (extra).

---

## Dificuldades encontradas

- Sincronizar o saldo exibido na navbar logo após uma aposta (resolvido atualizando o Context).
- Apurar várias apostas de um evento e creditar os saldos corretamente ao registrar o resultado.
- Garantir o controle de acesso por perfil em todas as rotas.

---

## Melhorias futuras

- Substituir o login simulado por autenticação real com token.
- Permitir editar eventos já cadastrados.
- Adicionar paginação e busca no histórico.
- Sistema de bônus diário fictício.

---
