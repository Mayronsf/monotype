# 🚂 Deploy no Railway - Passo a Passo

## ✅ Projeto já está no GitHub!

Seu projeto foi enviado com sucesso para: https://github.com/Mayronsf/monotype

## 🚀 Deploy no Railway (5 minutos)

### Passo 1: Criar Conta no Railway
1. Acesse: https://railway.app
2. Clique em **"Login"** ou **"Start a New Project"**
3. Faça login com sua conta **GitHub**

### Passo 2: Conectar Repositório
1. No dashboard do Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Autorize o Railway a acessar seus repositórios (se necessário)
4. Selecione o repositório: **`Mayronsf/monotype`**

### Passo 3: Configurar Deploy
O Railway vai detectar automaticamente que é um projeto Node.js!

**Se precisar configurar manualmente:**
- **Root Directory:** `.` (raiz)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Passo 4: Variáveis de Ambiente
1. No projeto Railway, vá em **"Variables"**
2. Adicione:
   ```
   NODE_ENV=production
   ```
   (A porta PORT é configurada automaticamente pelo Railway)

### Passo 5: Aguardar Deploy
- O Railway vai automaticamente:
  - Instalar dependências
  - Fazer build do frontend
  - Iniciar o servidor
- Aguarde 2-3 minutos
- Você verá uma URL tipo: `https://seu-projeto.railway.app`

### Passo 6: Pronto! 🎉
Seu site está no ar! Todos podem acessar e ver os mesmos dados!

## 🔗 Domínio Personalizado (Opcional)

1. No Railway, vá em **"Settings"**
2. Em **"Domains"**, clique em **"Generate Domain"**
3. Ou adicione seu próprio domínio

## 📊 Monitoramento

- **Logs:** Veja os logs em tempo real no Railway
- **Métricas:** CPU, RAM, etc.
- **Deploy automático:** Toda vez que você fizer push no GitHub, o Railway faz deploy automaticamente!

## ⚙️ Configurações Importantes

### Dados Persistentes
Os dados são salvos automaticamente em `server/data/championship.json` no Railway. Eles persistem entre deploys!

### HTTPS
O Railway fornece HTTPS automaticamente. Não precisa configurar nada!

## 🐛 Troubleshooting

### Erro no Build
- Verifique os logs no Railway
- Certifique-se de que `package.json` tem todas as dependências

### Erro ao Iniciar
- Verifique se `NODE_ENV=production` está configurado
- Verifique os logs para ver o erro específico

### Dados não aparecem
- O arquivo `server/data/championship.json` é criado automaticamente
- Verifique os logs para ver se há erros de permissão

## 🎯 Próximos Passos

1. ✅ Projeto no GitHub
2. ✅ Deploy no Railway
3. 🎉 Compartilhar a URL com todos!

**URL do seu repositório:** https://github.com/Mayronsf/monotype

