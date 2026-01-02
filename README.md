# 🏆 Liga da Pokéfirma - Campeonato Pokémon Monotype

Sistema de gerenciamento de campeonato Pokémon Monotype com dados compartilhados em tempo real.

## 🚀 Funcionalidades

- ✅ Fase de Grupos (Round-robin)
- ✅ Classificação automática
- ✅ Mata-Mata (Semifinais e Final)
- ✅ Dados compartilhados entre todos os usuários
- ✅ Atualização em tempo real
- ✅ Interface responsiva e moderna

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório ou baixe os arquivos
2. Instale as dependências:

```bash
npm install
```

## 🎮 Como Usar

### Desenvolvimento

Para rodar o projeto em modo de desenvolvimento, você precisa iniciar tanto o servidor backend quanto o frontend:

**Terminal 1 - Servidor Backend:**
```bash
npm run server
```
O servidor estará rodando em `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
O frontend estará rodando em `http://localhost:5173`

### Produção

1. **Build do frontend:**
```bash
npm run build
```

2. **Iniciar servidor:**
```bash
npm start
```

O servidor irá servir tanto a API quanto os arquivos estáticos do frontend.

## 🌐 Configuração para Deploy

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

Para produção, ajuste `VITE_API_URL` para a URL do seu servidor.

### Deploy em Serviços de Hospedagem

#### Vercel / Netlify (Frontend) + Railway / Render (Backend)

1. **Backend (Railway/Render):**
   - Faça deploy do servidor (`server/index.js`)
   - Configure a variável `PORT` (geralmente fornecida automaticamente)
   - O arquivo `server/data/championship.json` será criado automaticamente

2. **Frontend (Vercel/Netlify):**
   - Configure a variável `VITE_API_URL` com a URL do seu backend
   - Faça build e deploy

#### Deploy Completo em um Servidor

1. **Instale as dependências:**
```bash
npm install
```

2. **Build do frontend:**
```bash
npm run build
```

3. **Configure o servidor para servir:**
   - API: `server/index.js` na porta 3001
   - Arquivos estáticos: pasta `dist/` na porta 80/443

4. **Inicie o servidor:**
```bash
npm start
```

## 📁 Estrutura do Projeto

```
├── server/              # Backend (Express.js)
│   ├── index.js        # Servidor e API
│   └── data/           # Dados do campeonato (JSON)
├── src/                # Frontend (React)
│   ├── components/     # Componentes React
│   ├── context/        # Context API
│   ├── pages/          # Páginas
│   └── data/           # Dados estáticos
└── dist/              # Build de produção
```

## 🔌 API Endpoints

- `GET /api/data` - Obter todos os dados
- `GET /api/standings/:groupId` - Obter classificação de um grupo
- `PUT /api/data` - Atualizar todos os dados
- `POST /api/results` - Adicionar/atualizar resultado de partida
- `DELETE /api/results` - Remover resultado de partida
- `POST /api/bracket-results` - Adicionar/atualizar resultado do mata-mata
- `DELETE /api/bracket-results` - Remover resultado do mata-mata
- `POST /api/reset` - Resetar todos os dados

## 📊 Dados Compartilhados

Todos os dados são armazenados no servidor e compartilhados entre todos os usuários:
- ✅ Pontuações e classificação
- ✅ Resultados das partidas
- ✅ Resultados do mata-mata
- ✅ Atualização automática a cada 5 segundos

## 🎯 Como Funciona

1. **Dados Centralizados:** Todos os dados são salvos no servidor em `server/data/championship.json`
2. **Sincronização:** O frontend atualiza automaticamente a cada 5 segundos
3. **Edições em Tempo Real:** Qualquer usuário pode editar e todos veem as mudanças

## 🐛 Troubleshooting

### Erro de conexão com a API

- Verifique se o servidor está rodando (`npm run server`)
- Verifique a URL da API no arquivo `.env`
- Verifique se a porta 3001 está disponível

### Dados não aparecem

- Verifique o console do navegador para erros
- Verifique se o arquivo `server/data/championship.json` existe
- Tente resetar os dados usando o endpoint `/api/reset`

## 📝 Licença

Este projeto é privado e de uso interno.
