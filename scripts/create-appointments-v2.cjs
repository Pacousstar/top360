// Script pour créer la table appointments via Supabase Admin
// Tentative de connexion directe PostgreSQL

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'server', '.env');
const env = fs.readFileSync(envPath, 'utf-8');

const supabaseUrl = env.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
const serviceKey = env.match(/SUPABASE_SERVICE_KEY=(.+)/)?.[1]?.trim();

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('🔍 Vérification si la table appointments existe...');

  // Vérifier via information_schema (accessible via REST)
  try {
    const { data: tables, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'appointments');

    if (error) {
      console.log('⚠️  Impossible de lire information_schema via REST:', error.message);
    } else if (tables && tables.length > 0) {
      console.log('✅ La table appointments existe déjà !');
      return;
    } else {
      console.log('📋 La table appointments n\'existe pas encore');
    }
  } catch (e) {
    console.log('⚠️  Erreur:', e.message);
  }

  // Tentative d'exécution SQL via la route supabase
  // Supabase expose pg_dump et d'autres endpoints internes
  const sql = `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_type') THEN
    CREATE TYPE appointment_type AS ENUM ('service', 'sante', 'education', 'immo', 'event');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('en_attente', 'confirme', 'refuse', 'annule');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS appointments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  type              appointment_type NOT NULL,
  item_name         TEXT NOT NULL,
  client_name       TEXT NOT NULL,
  client_phone      TEXT NOT NULL,
  client_email      TEXT,
  preferred_date    DATE,
  preferred_time    TIME,
  message           TEXT,
  guests            INTEGER,
  niveau            TEXT,
  motif             TEXT,
  status            appointment_status NOT NULL DEFAULT 'en_attente',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_restaurant ON appointments(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
`;

  // Méthode 1: Tentative via rpc custom (si la fonction existe)
  console.log('\n🔄 Méthode 1: Tentative via rpc(\'exec_sql\')...');
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', { query: sql });
    if (!error) {
      console.log('✅ Table créée avec succès via exec_sql !');
      return;
    }
    console.log('  ->', error.message);
  } catch (e) { /* ignore */ }

  // Méthode 2: Tentative via le endpoint /sql avec fetch
  console.log('\n🔄 Méthode 2: Tentative fetch direct /sql...');
  try {
    const https = require('https');
    const result = await new Promise((resolve, reject) => {
      const urlObj = new URL('/sql', supabaseUrl);
      const data = JSON.stringify({ query: sql });
      const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
    console.log(`  -> Statut: ${result.status}, Réponse: ${result.body}`);
  } catch (e) { console.log('  -> Erreur:', e.message); }

  // Méthode 3: Vérifier les fonctions disponibles
  console.log('\n🔄 Méthode 3: Liste des fonctions RPC disponibles...');
  try {
    const { data: funcs } = await supabaseAdmin
      .from('information_schema.routines')
      .select('specific_name, routine_name')
      .eq('specific_schema', 'public');
    if (funcs) {
      const names = funcs.map(f => f.routine_name).filter(Boolean);
      console.log(`  Fonctions trouvées: ${names.join(', ') || 'aucune'}`);
    }
  } catch (e) { console.log('  ->', e.message); }

  // Méthode 4: Vérifier si pg extension avec exec possible
  console.log('\n🔄 Méthode 4: Tentative via pg_tle...');
  try {
    const { error } = await supabaseAdmin.rpc('pgsql_exec', { query_string: sql });
    if (!error) {
      console.log('✅ Table créée via pgsql_exec !');
      return;
    }
    console.log('  ->', error?.message || 'Fonction non trouvée');
  } catch (e) { /* ignore */ }

  console.log('\n❌ Aucune méthode automatique n\'a fonctionné.');
  console.log('\n📋 Pour créer la table manuellement dans Supabase:');
  console.log('   1. Va sur https://supabase.com/dashboard');
  console.log('   2. Sélectionne le projet');
  console.log('   3. SQL Editor → New Query');
  console.log('   4. Copie le fichier database/schema.sql sections 12b');
  console.log('   5. Exécute\n');
}

main().catch(console.error);
