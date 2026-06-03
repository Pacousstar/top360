// Script pour créer la table appointments dans Supabase
// Usage: node scripts/create-appointments-table.cjs

const https = require('https');
const fs = require('fs');
const path = require('path');

// Lire le .env du serveur
const envPath = path.join(__dirname, '..', 'server', '.env');
const env = fs.readFileSync(envPath, 'utf-8');

const supabaseUrl = env.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
const serviceKey = env.match(/SUPABASE_SERVICE_KEY=(.+)/)?.[1]?.trim();

if (!supabaseUrl || !serviceKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY non trouvés dans server/.env');
  process.exit(1);
}

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
console.log(`🔌 Connexion à Supabase project: ${projectRef}`);

const sql = `
-- 12b. TABLE: appointments (réservations & rendez-vous)
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

// Essayer via le endpoint /sql de Supabase
function runSQL() {
  return new Promise((resolve, reject) => {
    const url = new URL('/sql', supabaseUrl);
    const data = JSON.stringify({ query: sql });

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, status: res.statusCode, body });
        } else {
          resolve({ success: false, status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 Création de la table appointments...\n');

  const result = await runSQL();

  if (result.success) {
    console.log('✅ Table appointments créée avec succès !');
    console.log('📋 Réponse:', result.body);
  } else {
    console.log(`⚠️  Endpoint /sql a répondu ${result.status}`);
    console.log('📋 Réponse:', result.body);
    console.log('\n🔄 Tentative via Management API...');

    // Tentative via Management API
    try {
      const mgmtResult = await runViaManagementAPI(projectRef, serviceKey, sql);
      if (mgmtResult.success) {
        console.log('✅ Table créée via Management API !');
      } else {
        console.log('❌', mgmtResult.body);
        printManualInstructions();
      }
    } catch (err) {
      console.error('❌ Erreur:', err.message);
      printManualInstructions();
    }
  }
}

async function runViaManagementAPI(ref, token, query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${ref}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          body,
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

function printManualInstructions() {
  console.log('\n⚠️  Impossible de créer la table automatiquement.');
  console.log('\n📋 Pour créer la table manuellement :');
  console.log('   1. Va sur https://supabase.com/dashboard');
  console.log('   2. Sélectionne le projet "jelkgotnatpxhnomklct"');
  console.log('   3. Va dans "SQL Editor"');
  console.log('   4. Copie-colle le contenu du fichier database/schema.sql section 12b');
  console.log('   5. Exécute la requête\n');
}

main().catch(console.error);
