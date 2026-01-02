# 🚀 Guia de Deploy

## Passo a Passo para Subir o Site

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
NODE_ENV=production
```

**Para produção**, ajuste `VITE_API_URL` para a URL do seu servidor:
```env
VITE_API_URL=https://seu-dominio.com/api
```

### 3. Build do Frontend

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos estáticos.

### 4. Iniciar o Servidor

```bash
npm start
```

O servidor estará rodando e servindo tanto a API quanto o frontend.

## 🌐 Opções de Deploy

### Opção 1: Deploy Completo em um Servidor (Recomendado)

**Vantagens:**
- ✅ Tudo em um lugar
- ✅ Dados compartilhados funcionam perfeitamente
- ✅ Mais simples de gerenciar

**Passos:**
1. Faça upload de todos os arquivos para o servidor
2. Execute `npm install` no servidor
3. Execute `npm run build`
4. Configure a variável `VITE_API_URL` no `.env`
5. Execute `npm start` ou configure um processo manager (PM2)

**Exemplo com PM2:**
```bash
npm install -g pm2
pm2 start server/index.js --name championship
pm2 save
pm2 startup
```

### Opção 2: Backend e Frontend Separados

**Backend (Railway, Render, Heroku):**
1. Faça deploy apenas da pasta `server/`
2. Configure a variável `PORT` (geralmente automático)
3. Anote a URL do backend (ex: `https://seu-backend.railway.app`)

**Frontend (Vercel, Netlify):**
1. Configure a variável `VITE_API_URL` com a URL do backend
2. Faça build e deploy

**Importante:** O arquivo `server/data/championship.json` será criado automaticamente no servidor.

## 🔧 Configurações Importantes

### Porta do Servidor

O servidor usa a porta definida em `PORT` ou padrão `3001`.

### CORS

O servidor já está configurado para aceitar requisições de qualquer origem. Se precisar restringir, edite `server/index.js`:

```javascript
app.use(cors({
  origin: 'https://seu-dominio.com'
}));
```

### Dados Persistentes

Os dados são salvos em `server/data/championship.json`. Certifique-se de que:
- O diretório `server/data/` tem permissões de escrita
- O arquivo não está no `.gitignore` (mas os dados sim)

## 📝 Checklist de Deploy

- [ ] Dependências instaladas (`npm install`)
- [ ] Variável `VITE_API_URL` configurada corretamente
- [ ] Build do frontend feito (`npm run build`)
- [ ] Servidor iniciado e funcionando
- [ ] Testado localmente antes de fazer deploy
- [ ] Backup dos dados (se houver dados antigos)

## 🐛 Troubleshooting

### Erro: "Cannot find module"
- Execute `npm install` novamente
- Verifique se todas as dependências estão no `package.json`

### Erro: "Port already in use"
- Altere a porta no `.env` ou pare o processo que está usando a porta

### Dados não persistem
- Verifique permissões do diretório `server/data/`
- Verifique se o servidor tem permissão de escrita

### Frontend não conecta com API
- Verifique se `VITE_API_URL` está correto
- Verifique se o servidor está rodando
- Verifique CORS no servidor

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12)
2. Logs do servidor
3. Arquivo `server/data/championship.json` existe e tem dados válidos

