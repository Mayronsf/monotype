# Estrutura do Banco de Dados do Campeonato

## Visão Geral

O sistema utiliza **localStorage** como banco de dados local para armazenar todos os dados do campeonato. A estrutura foi projetada para ser robusta, versionada e fácil de manter.

## Estrutura do Banco

```json
{
  "version": "1.0.0",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "standings": {
    "groupA": [...],
    "groupB": [...]
  },
  "results": {
    "groupA": {...},
    "groupB": {...}
  },
  "bracketResults": {...},
  "metadata": {
    "totalMatches": 0,
    "totalBracketMatches": 0
  }
}
```

## Campos Detalhados

### `version` (string)
Versão do schema do banco de dados. Usado para migração e validação.

### `createdAt` (string ISO 8601)
Data e hora de criação do banco de dados.

### `lastUpdated` (string ISO 8601)
Data e hora da última atualização.

### `standings` (object)
Classificação dos jogadores por grupo.

#### `standings.groupA` e `standings.groupB` (array)
Array de objetos de jogadores com:
- `id` (string): ID único do jogador
- `name` (string): Nome do jogador
- `type` (string): Tipo do Pokémon
- `typeName` (string): Nome do tipo em português
- `emoji` (string): Emoji do jogador
- `games` (number): Total de jogos
- `wins` (number): Total de vitórias
- `losses` (number): Total de derrotas
- `points` (number): Total de pontos (3 por vitória)
- `pokemonDiff` (number): Saldo de Pokémon

### `results` (object)
Resultados das partidas da fase de grupos.

#### `results.groupA` e `results.groupB` (object)
Objeto onde cada chave é no formato: `{groupId}-{round}-{matchIndex}`
Exemplo: `"A-1-0"` = Grupo A, Rodada 1, Partida 0

Cada resultado contém:
- `winnerId` (string): ID do jogador vencedor
- `loserId` (string): ID do jogador perdedor
- `pokemonDiff` (number): Saldo de Pokémon da partida

### `bracketResults` (object)
Resultados das partidas do mata-mata.

Chaves: `"sf1"`, `"sf2"`, `"final"`

Cada resultado contém:
- `winnerId` (string): ID do jogador vencedor
- `loserId` (string): ID do jogador perdedor
- `player1Id` (string): ID do primeiro jogador
- `player2Id` (string): ID do segundo jogador
- `pokemonDiff` (number): Saldo de Pokémon da partida

### `metadata` (object)
Estatísticas gerais do campeonato.
- `totalMatches` (number): Total de partidas da fase de grupos
- `totalBracketMatches` (number): Total de partidas do mata-mata

## Funcionalidades

### Reset Automático
O banco de dados é resetado automaticamente na primeira carga da aplicação, garantindo que todos os dados comecem do zero.

### Limpeza Automática
O sistema automaticamente:
- Remove jogadores que não estão mais na lista válida
- Remove resultados de partidas com jogadores inválidos
- Normaliza a estrutura dos dados

### Versionamento
O sistema verifica a versão do banco e cria um novo se a versão mudar, garantindo compatibilidade.

### Backup e Restore
Funções disponíveis:
- `exportData()`: Exporta todos os dados para um arquivo JSON
- `importData(jsonData)`: Importa dados de um arquivo JSON

## LocalStorage Keys

- `championshipData`: Dados principais do campeonato
- `championshipDataVersion`: Versão do schema atual

## Tratamento de Erros

- Se o localStorage estiver cheio, o sistema avisa no console
- Se houver erro ao carregar, cria um novo banco vazio
- Validação automática da estrutura dos dados

