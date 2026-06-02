import bcrypt from 'bcryptjs';

const SUPABASE_URL = 'https://jelkgotnatpxhnomklct.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbGtnb3RuYXRweGhub21rbGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0NTU4NSwiZXhwIjoyMDk1OTIxNTg1fQ.5awmIhlzd6h0Mfql5b5-RTIl6rSUxFOgttRWpBsAJzI';

const headers = { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

async function api(method, table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${method} ${table}: ${res.status} ${txt}`);
  }
  return res.status === 201 || res.status === 204 ? null : await res.json();
}

const HASH_RESTO = await bcrypt.hash('resto123', 10);
const HASH_CLIENT = await bcrypt.hash('client123', 10);

async function main() {
  console.log('Seed TOP 360°...\n');

  // Nettoyage
  await api('DELETE', 'menu_items?id=neq.00000000-0000-0000-0000-000000000000');
  await api('DELETE', 'menu_categories?id=neq.00000000-0000-0000-0000-000000000000');
  await api('DELETE', 'restaurants?id=neq.00000000-0000-0000-0000-000000000000');
  await api('DELETE', 'users?id=neq.00000000-0000-0000-0000-000000000000');
  console.log('Nettoyage OK');

  // Users
  await api('POST', 'users', [
    { id: '10000000-0000-0000-0000-000000000001', fullname: 'Mamadou Koné', email: 'mamadou@test.ci', phone: '+2250102030405', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000002', fullname: 'Fatou Diallo', email: 'fatou@test.ci', phone: '+2250102030406', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '20000000-0000-0000-0000-000000000001', fullname: 'Koffi Jean', email: 'koffi@test.ci', phone: '+2250102030407', password_hash: HASH_CLIENT, role: 'client' },
  ]);
  console.log('Users OK');

  // Restaurants
  await api('POST', 'restaurants', [
    {
      id: '30000000-0000-0000-0000-000000000001', owner_id: '10000000-0000-0000-0000-000000000001',
      name: 'Chez Tantie Marie', slug: 'chez-tantie-marie',
      description: 'Véritable cuisine locale traditionnelle - plats africains faits maison',
      module: 'top_delice', phone: '+2250102030405', city: 'Duékoué',
      latitude: 6.7419, longitude: -7.3486, is_open: true, is_verified: true,
      subscription_plan: 'business',
      logo: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop',
    },
    {
      id: '30000000-0000-0000-0000-000000000002', owner_id: '10000000-0000-0000-0000-000000000002',
      name: 'Porc Braisé du Carrefour', slug: 'porc-braise-carrefour',
      description: 'Le meilleur porc braisé de la région - grillades et sauce',
      module: 'top_delice', phone: '+2250102030406', city: 'Bangolo',
      latitude: 6.485, longitude: -7.412, is_open: true, is_verified: true,
      subscription_plan: 'starter',
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop',
    },
  ]);
  console.log('Restaurants OK');

  // Catégories Tantie Marie
  const [cat1, cat2, cat3] = await Promise.all([
    api('POST', 'menu_categories', { restaurant_id: '30000000-0000-0000-0000-000000000001', name: 'Plats Principaux', sort_order: 1, id: '40000000-0000-0000-0000-000000000001' }),
    api('POST', 'menu_categories', { restaurant_id: '30000000-0000-0000-0000-000000000001', name: 'Grillades', sort_order: 2, id: '40000000-0000-0000-0000-000000000002' }),
    api('POST', 'menu_categories', { restaurant_id: '30000000-0000-0000-0000-000000000001', name: 'Boissons', sort_order: 3, id: '40000000-0000-0000-0000-000000000003' }),
  ]);
  console.log('Catégories Tantie Marie OK');

  // Catégories Porc Braisé
  const [cat4, cat5] = await Promise.all([
    api('POST', 'menu_categories', { restaurant_id: '30000000-0000-0000-0000-000000000002', name: 'Spécialités', sort_order: 1, id: '40000000-0000-0000-0000-000000000004' }),
    api('POST', 'menu_categories', { restaurant_id: '30000000-0000-0000-0000-000000000002', name: 'Accompagnements', sort_order: 2, id: '40000000-0000-0000-0000-000000000005' }),
  ]);
  console.log('Catégories Porc Braisé OK');

  // Plats Chez Tantie Marie
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000001', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000001', name: 'Attiéké Poisson', description: 'Attiéké frais avec poisson braisé et légumes', base_price: 2500, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', is_available: true, cooking_types: ['grillé', 'sauce'], accompaniments: ['attiéké', 'riz'] },
    { id: '50000000-0000-0000-0000-000000000002', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000001', name: 'Riz Sauce Graine', description: 'Riz blanc accompagné de sauce graine et poisson', base_price: 2000, image: 'https://images.unsplash.com/photo-1599043513900-6b3f05e5e3e9?w=400&h=400&fit=crop', is_available: true, cooking_types: ['sauce'], accompaniments: ['riz'] },
    { id: '50000000-0000-0000-0000-000000000003', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000002', name: 'Poulet Braisé', description: "Poulet fermier braisé accompagné d'attiéké", base_price: 3500, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop', is_available: true, cooking_types: ['braisé', 'grillé'], accompaniments: ['attiéké', 'frites'] },
    { id: '50000000-0000-0000-0000-000000000004', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000002', name: 'Poisson Braisé', description: 'Mérou braisé au four, sauce légumes', base_price: 4000, image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=400&h=400&fit=crop', is_available: true, cooking_types: ['braisé', 'grillé'], accompaniments: ['attiéké', 'riz', 'frites'] },
    { id: '50000000-0000-0000-0000-000000000005', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000003', name: 'Jus de Bissap', description: 'Bissap frais fait maison', base_price: 1000, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000006', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000003', name: 'Jus de Gingembre', description: 'Gingembre frais, citron, menthe', base_price: 1000, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('Plats Tantie Marie OK');

  // Plats Porc Braisé
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000007', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000004', name: 'Porc Braisé', description: 'Porc braisé aux épices, sauce pimentée', base_price: 3000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', is_available: true, cooking_types: ['braisé', 'grillé'], accompaniments: ['attiéké', 'pain'] },
    { id: '50000000-0000-0000-0000-000000000008', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000004', name: 'Porc Sauce', description: 'Porc mijoté dans une sauce tomate relevée', base_price: 3000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', is_available: true, cooking_types: ['sauce'], accompaniments: ['riz', 'frites'] },
    { id: '50000000-0000-0000-0000-000000000009', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000005', name: 'Alloco', description: 'Bananes plantain frites', base_price: 800, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000010', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000005', name: 'Salade', description: 'Salade verte, tomate, oignon, vinaigrette', base_price: 500, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('Plats Porc Braisé OK');

  console.log('\n✅ Seed terminé avec succès !');
  console.log('   3 utilisateurs, 2 restaurants, 5 catégories, 10 plats');
  console.log('\n👤 Identifiants :');
  console.log('   mamadou@test.ci / resto123 (Chez Tantie Marie)');
  console.log('   fatou@test.ci / resto123 (Porc Braisé du Carrefour)');
  console.log('   koffi@test.ci / client123 (client)');
}

main().catch(console.error);
