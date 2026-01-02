// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Carregar variáveis de ambiente do arquivo .env
try {
  const envContent = readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        const value = trimmed.substring(equalIndex + 1).trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    }
  });
} catch (error) {
  console.log('⚠️  Arquivo .env não encontrado, usando variáveis do sistema');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_ANON_KEY não configurados!');
  process.exit(1);
}

console.log('🔗 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

// Testar conexão
async function testConnection() {
  try {
    // Tentar ler da tabela standings
    const { data, error } = await supabase
      .from('standings')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('⚠️  Tabelas ainda não foram criadas!');
        console.log('📋 Execute o SQL em supabase/schema.sql no SQL Editor do Supabase');
        return false;
      }
      console.error('❌ Erro:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase funcionando!');
    console.log('✅ Tabelas criadas corretamente!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Tudo configurado e funcionando!');
  } else {
    console.log('\n📝 Próximo passo: Execute o SQL em supabase/schema.sql');
  }
  process.exit(success ? 0 : 1);
});

