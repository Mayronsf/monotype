# 🚀 Executar SQL no Supabase - PASSO A PASSO

## ✅ Suas Credenciais já estão configuradas!

O arquivo `.env` já foi criado com suas credenciais do Supabase.

## 📋 Agora você precisa executar o SQL:

### Passo 1: Abrir SQL Editor no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**

### Passo 2: Copiar e Colar o SQL

1. Abra o arquivo `supabase/schema.sql` do seu projeto
2. Selecione **TODO** o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)
4. Cole no SQL Editor do Supabase (Ctrl+V)

### Passo 3: Executar

1. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
2. Aguarde alguns segundos
3. Você deve ver: **"Success. No rows returned"** ✅

### Passo 4: Verificar se funcionou

1. No Supabase, vá em **"Table Editor"** (menu lateral)
2. Você deve ver 3 tabelas:
   - ✅ `standings`
   - ✅ `group_results`
   - ✅ `bracket_results`
3. Clique em `standings` e verifique se há 8 jogadores (4 do Grupo A e 4 do Grupo B)

## ✅ Pronto!

Agora você pode testar:

```bash
npm run server
```

Deve aparecer: `✅ Conectado ao Supabase`

---

## 🔍 Se der erro:

### Erro: "relation already exists"
- As tabelas já existem, tudo certo! Pode ignorar.

### Erro: "permission denied"
- Execute o SQL novamente, pode ter faltado alguma parte.

### Erro: "policy already exists"
- As políticas já existem, pode ignorar.

---

**O SQL está no arquivo:** `supabase/schema.sql`

