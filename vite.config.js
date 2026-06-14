import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite (ferramenta de build/dev server do projeto React).
// O plugin-react habilita o suporte a JSX e ao Fast Refresh (atualização
// automática da tela ao salvar um arquivo).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Porta onde o front-end React vai rodar (npm run dev)
  },
})
