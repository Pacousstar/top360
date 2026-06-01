import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Variables SUPABASE_URL et SUPABASE_ANON_KEY requises');
  process.exit(1);
}

// Client public (frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client service (backend - contourne RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
