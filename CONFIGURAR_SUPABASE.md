# 🗄️ Configurar Supabase - Guia Completo

## ✅ Por que Supabase?

- ✅ **Banco de dados PostgreSQL em nuvem** (grátis até 500MB)
- ✅ **API REST automática**
- ✅ **Real-time subscriptions** (atualizações em tempo real)
- ✅ **Fácil de configurar**
- ✅ **Dados persistentes e seguros**
- ✅ **Escalável**

## 🚀 Passo a Passo

### 1. Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado)
4. Clique em **"New Project"**

### 2. Criar Projeto

1. **Nome do Projeto:** `championship` (ou qualquer nome)
2. **Database Password:** Crie uma senha forte (anote ela!)
3. **Region:** Escolha a região mais próxima (ex: `South America (São Paulo)`)
4. **Pricing Plan:** Free (grátis)
5. Clique em **"Create new project"**
6. Aguarde 2-3 minutos para o projeto ser criado

### 3. Obter Credenciais

1. No dashboard do Supabase, vá em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (uma chave longa)

**Anote essas duas informações!**

### 4. Criar Tabelas no Banco

1. No Supabase, vá em **"SQL Editor"** (no menu lateral)
2. Clique em **"New query"**
3. Copie e cole todo o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **"Run"** (ou pressione Ctrl+Enter)
5. Você deve ver: **"Success. No rows returned"**

✅ **Pronto!** As tabelas foram criadas!

### 5. Configurar Variáveis de Ambiente

#### Localmente (Desenvolvimento):

Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
PORT=3001
NODE_ENV=development
```

**Substitua:**
- `https://seu-projeto.supabase.co` pela sua Project URL
- `sua-chave-anon-aqui` pela sua anon public key

#### Em Produção (Railway/Render):

1. No Railway/Render, vá em **"Variables"** ou **"Environment"**
2. Adicione:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anon-aqui
   NODE_ENV=production
   ```

### 6. Instalar Dependências

```bash
npm install
```

Isso instalará o `@supabase/supabase-js`.

### 7. Testar

```bash
npm run server
```

Você deve ver:
```
✅ Conectado ao Supabase
🚀 Servidor rodando na porta 3001
```

## 📊 Estrutura das Tabelas

### `standings`
Armazena a classificação dos jogadores:
- `player_id` - ID do jogador
- `group_id` - Grupo (A ou B)
- `name`, `type`, `emoji` - Dados do jogador
- `games`, `wins`, `losses`, `points`, `pokemon_diff` - Estatísticas

### `group_results`
Armazena resultados das partidas da fase de grupos:
- `group_id`, `round`, `match_index` - Identificação da partida
- `winner_id`, `loser_id` - Jogadores
- `pokemon_diff` - Saldo de Pokémon

### `bracket_results`
Armazena resultados do mata-mata:
- `match_id` - ID da partida (sf1, sf2, final)
- `winner_id`, `loser_id` - Jogadores
- `player1_id`, `player2_id` - Jogadores originais
- `pokemon_diff` - Saldo de Pokémon

## 🔒 Segurança

O Supabase usa **Row Level Security (RLS)**. Para este projeto, vamos permitir leitura/escrita pública (já que é um campeonato compartilhado).

### Habilitar Acesso Público (Opcional):

No SQL Editor do Supabase, execute:

```sql
-- Permitir leitura e escrita pública nas tabelas
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE bracket_results ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (todos podem ler e escrever)
CREATE POLICY "Public read" ON standings FOR SELECT USING (true);
CREATE POLICY "Public insert" ON standings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON standings FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON standings FOR DELETE USING (true);

CREATE POLICY "Public read" ON group_results FOR SELECT USING (true);
CREATE POLICY "Public insert" ON group_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON group_results FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON group_results FOR DELETE USING (true);

CREATE POLICY "Public read" ON bracket_results FOR SELECT USING (true);
CREATE POLICY "Public insert" ON bracket_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON bracket_results FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON bracket_results FOR DELETE USING (true);
```

**Nota:** Isso permite que qualquer pessoa leia e escreva. Para produção, você pode restringir depois.

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Execute o `schema.sql` novamente no SQL Editor
- Verifique se as tabelas foram criadas em **"Table Editor"**

### Erro: "Invalid API key"
- Verifique se copiou a chave correta (anon public key, não service role key)
- Verifique se não há espaços extras na variável de ambiente

### Erro: "permission denied"
- Execute as políticas de segurança SQL acima
- Ou desabilite RLS temporariamente para testar

### Dados não aparecem
- Verifique se os jogadores foram inseridos (execute o INSERT do schema.sql)
- Verifique os logs do servidor para erros

## ✅ Checklist

- [ ] Conta criada no Supabase
- [ ] Projeto criado
- [ ] Credenciais anotadas (URL e Key)
- [ ] Schema SQL executado
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor testado localmente
- [ ] Variáveis configuradas em produção

## 🎉 Pronto!

Agora seu projeto usa um banco de dados PostgreSQL em nuvem! Todos os dados são salvos no Supabase e compartilhados entre todos os usuários.

**Vantagens:**
- ✅ Dados persistentes
- ✅ Backup automático
- ✅ Escalável
- ✅ API REST automática
- ✅ Real-time (pode adicionar depois)

