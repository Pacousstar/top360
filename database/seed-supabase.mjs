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
  console.log('Seed TOP 360° — Tous les modules\n');

  // Nettoyage
  await api('DELETE', 'menu_items?id=neq.00000000-0000-0000-0000-000000000000');
  await api('DELETE', 'menu_categories?id=neq.00000000-0000-0000-0000-000000000000');
  await api('DELETE', 'restaurants?id=neq.00000000-0000-0000-0000-000000000000');
  await api('DELETE', 'users?id=neq.00000000-0000-0000-0000-000000000000');
  console.log('Nettoyage OK\n');

  // ── UTILISATEURS ──
  const users = [
    { id: '10000000-0000-0000-0000-000000000001', fullname: 'Mamadou Koné', email: 'mamadou@test.ci', phone: '+2250102030401', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000002', fullname: 'Fatou Diallo', email: 'fatou@test.ci', phone: '+2250102030402', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000003', fullname: 'Kouamé Hôtel', email: 'kouame.hotel@test.ci', phone: '+2250102030403', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000004', fullname: 'Bamba Construction', email: 'bamba.bat@test.ci', phone: '+2250102030404', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000005', fullname: 'Aminata Boutique', email: 'amina.shop@test.ci', phone: '+2250102030405', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000006', fullname: 'Touré Auto', email: 'toure.auto@test.ci', phone: '+2250102030406', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000007', fullname: 'Konan Services', email: 'konan.serv@test.ci', phone: '+2250102030407', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000008', fullname: 'Docteur Kouassi', email: 'docteur.sante@test.ci', phone: '+2250102030408', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-000000000009', fullname: 'Institut Yéo', email: 'institut.edu@test.ci', phone: '+2250102030409', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-00000000000a', fullname: 'Agence Immobilière du Centre', email: 'agence.immo@test.ci', phone: '+2250102030410', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '10000000-0000-0000-0000-00000000000b', fullname: 'Kouamé Event', email: 'kouame.event@test.ci', phone: '+2250102030411', password_hash: HASH_RESTO, role: 'restaurant' },
    { id: '20000000-0000-0000-0000-000000000001', fullname: 'Koffi Jean', email: 'koffi@test.ci', phone: '+2250102030412', password_hash: HASH_CLIENT, role: 'client' },
  ];
  await api('POST', 'users', users);
  console.log(`${users.length} utilisateurs OK`);

  // ── RESTAURANTS / STRUCTURES ──
  const restaurants = [
    // 1-2. TOP DÉLICE
    { id: '30000000-0000-0000-0000-000000000001', owner_id: '10000000-0000-0000-0000-000000000001',
      name: 'Chez Tantie Marie', slug: 'chez-tantie-marie', module: 'top_delice',
      description: 'Véritable cuisine locale traditionnelle — plats africains faits maison',
      phone: '+2250102030401', city: 'Duékoué', address: null, latitude: 6.7419, longitude: -7.3486,
      is_open: true, is_verified: true, subscription_plan: 'business',
      logo: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop' },
    { id: '30000000-0000-0000-0000-000000000002', owner_id: '10000000-0000-0000-0000-000000000002',
      name: 'Porc Braisé du Carrefour', slug: 'porc-braise-carrefour', module: 'top_delice',
      description: 'Le meilleur porc braisé de la région — grillades et sauce',
      phone: '+2250102030402', city: 'Bangolo', address: null, latitude: 6.485, longitude: -7.412,
      is_open: true, is_verified: true, subscription_plan: 'starter',
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop' },
    // 3. TOP HÔTEL
    { id: '30000000-0000-0000-0000-000000000003', owner_id: '10000000-0000-0000-0000-000000000003',
      name: 'Hôtel Résidence Les Palmiers', slug: 'hotel-les-palmiers', module: 'top_hotel',
      description: 'Hôtel 3 étoiles avec piscine, restaurant et spa. Chambres climatisées, Wi-Fi haut débit.',
      phone: '+2250102030403', city: 'Abidjan', address: 'Cocody, Angré', latitude: 5.3400, longitude: -4.0100,
      is_open: true, is_verified: true, subscription_plan: 'premium',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=400&fit=crop' },
    // 4. TOP BAT
    { id: '30000000-0000-0000-0000-000000000004', owner_id: '10000000-0000-0000-0000-000000000004',
      name: 'Bamba Construction & Rénovation', slug: 'bamba-construction', module: 'top_bat',
      description: 'Entreprise générale de BTP — construction, rénovation, plomberie, électricité. Devis gratuit.',
      phone: '+2250102030404', city: 'Yamoussoukro', address: 'Zone industrielle', latitude: 6.8200, longitude: -5.2700,
      is_open: true, is_verified: true, subscription_plan: 'business',
      logo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=400&fit=crop' },
    // 5. TOP SHOP
    { id: '30000000-0000-0000-0000-000000000005', owner_id: '10000000-0000-0000-0000-000000000005',
      name: 'Aminata Beauty & Fashion', slug: 'amina-beauty', module: 'top_shop',
      description: 'Boutique de mode et cosmétiques — vêtements, chaussures, accessoires, maquillage.',
      phone: '+2250102030405', city: 'Abidjan', address: 'Adjamé', latitude: 5.3700, longitude: -4.0200,
      is_open: true, is_verified: true, subscription_plan: 'starter',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop' },
    // 6. TOP AUTO
    { id: '30000000-0000-0000-0000-000000000006', owner_id: '10000000-0000-0000-0000-000000000006',
      name: 'Touré Auto — Garage & Vente', slug: 'toure-auto', module: 'top_auto',
      description: 'Garage agréé — mécanique générale, vente de véhicules d\'occasion, location courte et longue durée.',
      phone: '+2250102030406', city: 'Bouaké', address: 'PK18', latitude: 7.6900, longitude: -5.0300,
      is_open: true, is_verified: true, subscription_plan: 'business',
      logo: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=400&fit=crop' },
    // 7. TOP SERVICES
    { id: '30000000-0000-0000-0000-000000000007', owner_id: '10000000-0000-0000-0000-000000000007',
      name: 'Konan Services — Transport & Logistique', slug: 'konan-services', module: 'top_services',
      description: 'Transport de marchandises, déménagement, location de véhicules avec chauffeur. Service fiable.',
      phone: '+2250102030407', city: 'San-Pédro', address: 'Quartier Soleil', latitude: 4.7500, longitude: -6.6500,
      is_open: true, is_verified: true, subscription_plan: 'starter',
      logo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1566576912324-b4c1f81e4e24?w=1200&h=400&fit=crop' },
    // 8. TOP SANTÉ
    { id: '30000000-0000-0000-0000-000000000008', owner_id: '10000000-0000-0000-0000-000000000008',
      name: 'Cabinet Médical Docteur Kouassi', slug: 'cabinet-dr-kouassi', module: 'top_sante',
      description: 'Cabinet médical généraliste — consultations, soins, analyses. Ouvert du lundi au samedi.',
      phone: '+2250102030408', city: 'Abidjan', address: 'Treichville', latitude: 5.3000, longitude: -4.0100,
      is_open: true, is_verified: true, subscription_plan: 'business',
      logo: 'https://images.unsplash.com/photo-1638202993928-5a5c3b8afc34?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=400&fit=crop' },
    // 9. TOP ÉDUCATION
    { id: '30000000-0000-0000-0000-000000000009', owner_id: '10000000-0000-0000-0000-000000000009',
      name: 'Institut Yéo — Formation & Cours', slug: 'institut-yeo-formation', module: 'top_education',
      description: 'Institut de formation professionnelle — bureautique, langues, comptabilité, développement personnel.',
      phone: '+2250102030409', city: 'Abidjan', address: 'Cocody Riviera', latitude: 5.3600, longitude: -3.9900,
      is_open: true, is_verified: true, subscription_plan: 'starter',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=400&fit=crop' },
    // 10. TOP IMMO
    { id: '30000000-0000-0000-0000-00000000000a', owner_id: '10000000-0000-0000-0000-00000000000a',
      name: 'Agence Immobilière du Centre', slug: 'agence-immo-centre', module: 'top_immo',
      description: 'Agence immobilière — vente, location, gestion locative. Plus de 200 biens dans tout le pays.',
      phone: '+2250102030410', city: 'Yamoussoukro', address: 'Quartier administratif', latitude: 6.8200, longitude: -5.2800,
      is_open: true, is_verified: true, subscription_plan: 'business',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop' },
    // 11. TOP EVENT
    { id: '30000000-0000-0000-0000-00000000000b', owner_id: '10000000-0000-0000-0000-00000000000b',
      name: 'Kouamé Event — Organisation & Animation', slug: 'kouame-event', module: 'top_event',
      description: 'Organisation d\'événements — mariages, anniversaires, séminaires, concerts. Devis gratuit.',
      phone: '+2250102030411', city: 'Abidjan', address: 'Cocody II Plateaux', latitude: 5.3500, longitude: -3.9800,
      is_open: true, is_verified: true, subscription_plan: 'starter',
      logo: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=400&fit=crop' },
  ];
  await api('POST', 'restaurants', restaurants);
  console.log(`${restaurants.length} structures OK`);

  // ── MENU CATÉGORIES + ITEMS PAR MODULE ──

  // TOP DÉLICE — Chez Tantie Marie
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000001', restaurant_id: '30000000-0000-0000-0000-000000000001', name: 'Plats Principaux', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000002', restaurant_id: '30000000-0000-0000-0000-000000000001', name: 'Grillades', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000003', restaurant_id: '30000000-0000-0000-0000-000000000001', name: 'Boissons', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000001', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000001', name: 'Attiéké Poisson', description: 'Attiéké frais avec poisson braisé et légumes', base_price: 2500, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', is_available: true, cooking_types: ['grillé', 'sauce'], accompaniments: ['attiéké', 'riz'] },
    { id: '50000000-0000-0000-0000-000000000002', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000001', name: 'Riz Sauce Graine', description: 'Riz blanc accompagné de sauce graine et poisson', base_price: 2000, image: 'https://images.unsplash.com/photo-1599043513900-6b3f05e5e3e9?w=400&h=400&fit=crop', is_available: true, cooking_types: ['sauce'], accompaniments: ['riz'] },
    { id: '50000000-0000-0000-0000-000000000003', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000002', name: 'Poulet Braisé', description: 'Poulet fermier braisé accompagné d\'attiéké', base_price: 3500, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop', is_available: true, cooking_types: ['braisé', 'grillé'], accompaniments: ['attiéké', 'frites'] },
    { id: '50000000-0000-0000-0000-000000000004', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000002', name: 'Poisson Braisé', description: 'Mérou braisé au four, sauce légumes', base_price: 4000, image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=400&h=400&fit=crop', is_available: true, cooking_types: ['braisé', 'grillé'], accompaniments: ['attiéké', 'riz', 'frites'] },
    { id: '50000000-0000-0000-0000-000000000005', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000003', name: 'Jus de Bissap', description: 'Bissap frais fait maison', base_price: 1000, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000006', restaurant_id: '30000000-0000-0000-0000-000000000001', category_id: '40000000-0000-0000-0000-000000000003', name: 'Jus de Gingembre', description: 'Gingembre frais, citron, menthe', base_price: 1000, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP DÉLICE — Chez Tantie Marie OK');

  // TOP DÉLICE — Porc Braisé du Carrefour
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000004', restaurant_id: '30000000-0000-0000-0000-000000000002', name: 'Spécialités', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000005', restaurant_id: '30000000-0000-0000-0000-000000000002', name: 'Accompagnements', sort_order: 2 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000007', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000004', name: 'Porc Braisé', description: 'Porc braisé aux épices, sauce pimentée', base_price: 3000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', is_available: true, cooking_types: ['braisé', 'grillé'], accompaniments: ['attiéké', 'pain'] },
    { id: '50000000-0000-0000-0000-000000000008', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000004', name: 'Porc Sauce', description: 'Porc mijoté dans une sauce tomate relevée', base_price: 3000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', is_available: true, cooking_types: ['sauce'], accompaniments: ['riz', 'frites'] },
    { id: '50000000-0000-0000-0000-000000000009', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000005', name: 'Alloco', description: 'Bananes plantain frites', base_price: 800, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000010', restaurant_id: '30000000-0000-0000-0000-000000000002', category_id: '40000000-0000-0000-0000-000000000005', name: 'Salade', description: 'Salade verte, tomate, oignon, vinaigrette', base_price: 500, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP DÉLICE — Porc Braisé OK');

  // TOP HÔTEL — Les Palmiers
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000010', restaurant_id: '30000000-0000-0000-0000-000000000003', name: 'Chambres', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000011', restaurant_id: '30000000-0000-0000-0000-000000000003', name: 'Suites', sort_order: 2 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000020', restaurant_id: '30000000-0000-0000-0000-000000000003', category_id: '40000000-0000-0000-0000-000000000010', name: 'Chambre Standard', description: 'Chambre climatisée avec lit double, TV, Wi-Fi, salle de bain privée', base_price: 25000, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000021', restaurant_id: '30000000-0000-0000-0000-000000000003', category_id: '40000000-0000-0000-0000-000000000010', name: 'Chambre Deluxe', description: 'Grande chambre vue piscine, lit king-size, mini-bar, coffre-fort', base_price: 35000, image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000022', restaurant_id: '30000000-0000-0000-0000-000000000003', category_id: '40000000-0000-0000-0000-000000000011', name: 'Suite Junior', description: 'Salon + chambre, baignoire balnéo, terrasse privée, room service 24h', base_price: 55000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000023', restaurant_id: '30000000-0000-0000-0000-000000000003', category_id: '40000000-0000-0000-0000-000000000011', name: 'Suite Présidentielle', description: '300m², vue panoramique, jacuzzi, cuisine équipée, conciergerie', base_price: 120000, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP HÔTEL — Les Palmiers OK');

  // TOP BAT — Bamba Construction
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000020', restaurant_id: '30000000-0000-0000-0000-000000000004', name: 'Construction', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000021', restaurant_id: '30000000-0000-0000-0000-000000000004', name: 'Rénovation', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000022', restaurant_id: '30000000-0000-0000-0000-000000000004', name: 'Plomberie & Électricité', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000030', restaurant_id: '30000000-0000-0000-0000-000000000004', category_id: '40000000-0000-0000-0000-000000000020', name: 'Construction Villa', description: 'Construction de villa moderne clé en main', base_price: 25000000, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000031', restaurant_id: '30000000-0000-0000-0000-000000000004', category_id: '40000000-0000-0000-0000-000000000020', name: 'Construction Immeuble', description: 'Immeuble R+3 à R+8 — bureaux, commerces, logements', base_price: 75000000, image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000032', restaurant_id: '30000000-0000-0000-0000-000000000004', category_id: '40000000-0000-0000-0000-000000000021', name: 'Rénovation Appartement', description: 'Rénovation complète — peinture, carrelage, plomberie, électricité', base_price: 3000000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000033', restaurant_id: '30000000-0000-0000-0000-000000000004', category_id: '40000000-0000-0000-0000-000000000022', name: 'Installation Électrique', description: 'Câblage, tableau électrique, prises, éclairage — neuf ou rénovation', base_price: 500000, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000034', restaurant_id: '30000000-0000-0000-0000-000000000004', category_id: '40000000-0000-0000-0000-000000000022', name: 'Plomberie Générale', description: 'Installation et dépannage — robinetterie, chauffe-eau, évacuations', base_price: 200000, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP BAT — Bamba Construction OK');

  // TOP SHOP — Aminata Beauty & Fashion
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000030', restaurant_id: '30000000-0000-0000-0000-000000000005', name: 'Vêtements', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000031', restaurant_id: '30000000-0000-0000-0000-000000000005', name: 'Cosmétiques', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000032', restaurant_id: '30000000-0000-0000-0000-000000000005', name: 'Accessoires', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000040', restaurant_id: '30000000-0000-0000-0000-000000000005', category_id: '40000000-0000-0000-0000-000000000030', name: 'Robe Africaine', description: 'Robe wax traditionnelle — plusieurs motifs disponibles', base_price: 15000, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000041', restaurant_id: '30000000-0000-0000-0000-000000000005', category_id: '40000000-0000-0000-0000-000000000030', name: 'Chemise Bazin', description: 'Chemise homme en bazin riche — coupe moderne', base_price: 12000, image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000042', restaurant_id: '30000000-0000-0000-0000-000000000005', category_id: '40000000-0000-0000-0000-000000000031', name: 'Huile de Karité Bio', description: 'Huile de karité pure 100% naturelle — soin corps et cheveux', base_price: 3000, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000043', restaurant_id: '30000000-0000-0000-0000-000000000005', category_id: '40000000-0000-0000-0000-000000000031', name: 'Savon Noir', description: 'Savon noir traditionnel au miel et à l\'aloe vera', base_price: 2000, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000044', restaurant_id: '30000000-0000-0000-0000-000000000005', category_id: '40000000-0000-0000-0000-000000000032', name: 'Sac en Cuir', description: 'Sac à main en cuir véritable — fabrication artisanale', base_price: 25000, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000045', restaurant_id: '30000000-0000-0000-0000-000000000005', category_id: '40000000-0000-0000-0000-000000000032', name: 'Boucles d\'Oreilles', description: 'Boucles d\'oreilles en perles de verre — fait main', base_price: 5000, image: 'https://images.unsplash.com/photo-1635767798638-3665c302e11e?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP SHOP — Aminata Beauty OK');

  // TOP AUTO — Touré Auto
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000040', restaurant_id: '30000000-0000-0000-0000-000000000006', name: 'Véhicules en Vente', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000041', restaurant_id: '30000000-0000-0000-0000-000000000006', name: 'Location', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000042', restaurant_id: '30000000-0000-0000-0000-000000000006', name: 'Services Garage', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000050', restaurant_id: '30000000-0000-0000-0000-000000000006', category_id: '40000000-0000-0000-0000-000000000040', name: 'Toyota Hilux 2021', description: 'Double cabine, climatisation, 4x4, 80000km — état impeccable', base_price: 18500000, image: 'https://images.unsplash.com/photo-1547744152-291d19c8e3b2?w=400&h=400&fit=crop', is_available: true, cooking_types: ['vente'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000051', restaurant_id: '30000000-0000-0000-0000-000000000006', category_id: '40000000-0000-0000-0000-000000000040', name: 'Kia Picanto 2022', description: 'Citadine économique, boîte auto, 5 places — idéale ville', base_price: 7500000, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=400&fit=crop', is_available: true, cooking_types: ['vente'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000052', restaurant_id: '30000000-0000-0000-0000-000000000006', category_id: '40000000-0000-0000-0000-000000000041', name: 'Location Berline', description: 'Berline climatisée — 25 000 FCFA/jour, caution 200 000 FCFA', base_price: 25000, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=400&fit=crop', is_available: true, cooking_types: ['location'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000053', restaurant_id: '30000000-0000-0000-0000-000000000006', category_id: '40000000-0000-0000-0000-000000000041', name: 'Location 4x4', description: '4x4 pour brousse — 45 000 FCFA/jour, chauffeur inclus', base_price: 45000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop', is_available: true, cooking_types: ['location'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000054', restaurant_id: '30000000-0000-0000-0000-000000000006', category_id: '40000000-0000-0000-0000-000000000042', name: 'Révision Complète', description: 'Vidange, filtres, bougies, freins — toutes marques', base_price: 75000, image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000055', restaurant_id: '30000000-0000-0000-0000-000000000006', category_id: '40000000-0000-0000-0000-000000000042', name: 'Diagnostic Moteur', description: 'Diagnostic électronique complet — valise de test', base_price: 15000, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP AUTO — Touré Auto OK');

  // TOP SERVICES — Konan Services
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000050', restaurant_id: '30000000-0000-0000-0000-000000000007', name: 'Transport', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000051', restaurant_id: '30000000-0000-0000-0000-000000000007', name: 'Déménagement', sort_order: 2 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000060', restaurant_id: '30000000-0000-0000-0000-000000000007', category_id: '40000000-0000-0000-0000-000000000050', name: 'Transport de Marchandises', description: 'Camion 10 tonnes — livraison Abidjan et intérieur du pays', base_price: 150000, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000061', restaurant_id: '30000000-0000-0000-0000-000000000007', category_id: '40000000-0000-0000-0000-000000000050', name: 'Course Urbaine', description: 'Livraison rapide en ville — colis, documents, courses', base_price: 5000, image: 'https://images.unsplash.com/photo-1566576912324-b4c1f81e4e24?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000062', restaurant_id: '30000000-0000-0000-0000-000000000007', category_id: '40000000-0000-0000-0000-000000000051', name: 'Déménagement Complet', description: 'Camion + 3 hommes + emballage — jusqu\'à 3 pièces', base_price: 200000, image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000063', restaurant_id: '30000000-0000-0000-0000-000000000007', category_id: '40000000-0000-0000-0000-000000000051', name: 'Location Camionnette', description: 'Camionnette avec chauffeur — 8h de service', base_price: 50000, image: 'https://images.unsplash.com/photo-1591696331111-ef6e4ed5b7dc?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP SERVICES — Konan Services OK');

  // TOP SANTÉ — Cabinet Docteur Kouassi
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000060', restaurant_id: '30000000-0000-0000-0000-000000000008', name: 'Consultations', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000061', restaurant_id: '30000000-0000-0000-0000-000000000008', name: 'Spécialités', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000062', restaurant_id: '30000000-0000-0000-0000-000000000008', name: 'Analyses', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000070', restaurant_id: '30000000-0000-0000-0000-000000000008', category_id: '40000000-0000-0000-0000-000000000060', name: 'Consultation Générale', description: 'Consultation médicale complète avec ordonnance', base_price: 10000, image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000071', restaurant_id: '30000000-0000-0000-0000-000000000008', category_id: '40000000-0000-0000-0000-000000000060', name: 'Consultation Pédiatrique', description: 'Consultation pour enfants de 0 à 15 ans', base_price: 12000, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000072', restaurant_id: '30000000-0000-0000-0000-000000000008', category_id: '40000000-0000-0000-0000-000000000061', name: 'Cardiologie', description: 'Consultation cardiologique avec électrocardiogramme', base_price: 20000, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000073', restaurant_id: '30000000-0000-0000-0000-000000000008', category_id: '40000000-0000-0000-0000-000000000061', name: 'Dermatologie', description: 'Consultation dermatologique — acné, eczéma, allergie', base_price: 15000, image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000074', restaurant_id: '30000000-0000-0000-0000-000000000008', category_id: '40000000-0000-0000-0000-000000000062', name: 'Bilan Sanguin', description: 'Analyse de sang complète (NFS, glycémie, cholestérol)', base_price: 8000, image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000075', restaurant_id: '30000000-0000-0000-0000-000000000008', category_id: '40000000-0000-0000-0000-000000000062', name: 'Test COVID & Paludisme', description: 'Test rapide COVID-19 et goutte épaisse paludisme', base_price: 5000, image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP SANTÉ — Cabinet Dr Kouassi OK');

  // TOP ÉDUCATION — Institut Yéo
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000070', restaurant_id: '30000000-0000-0000-0000-000000000009', name: 'Bureautique', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000071', restaurant_id: '30000000-0000-0000-0000-000000000009', name: 'Langues', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000072', restaurant_id: '30000000-0000-0000-0000-000000000009', name: 'Développement', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000080', restaurant_id: '30000000-0000-0000-0000-000000000009', category_id: '40000000-0000-0000-0000-000000000070', name: 'Excel & Tableurs', description: 'Formation complète Excel — débutant à avancé. 20h de cours.', base_price: 50000, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop', is_available: true, cooking_types: ['presentiel'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000081', restaurant_id: '30000000-0000-0000-0000-000000000009', category_id: '40000000-0000-0000-0000-000000000070', name: 'Comptabilité', description: 'Comptabilité générale et informatisée — niveau 1', base_price: 75000, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=400&fit=crop', is_available: true, cooking_types: ['presentiel', 'en_ligne'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000082', restaurant_id: '30000000-0000-0000-0000-000000000009', category_id: '40000000-0000-0000-0000-000000000071', name: 'Anglais', description: 'Anglais général et professionnel — tous niveaux', base_price: 60000, image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=400&fit=crop', is_available: true, cooking_types: ['presentiel', 'en_ligne'], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000083', restaurant_id: '30000000-0000-0000-0000-000000000009', category_id: '40000000-0000-0000-0000-000000000072', name: 'Développement Personnel', description: 'Confiance en soi, prise de parole, leadership', base_price: 35000, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop', is_available: true, cooking_types: ['presentiel'], accompaniments: [] },
  ]);
  console.log('TOP ÉDUCATION — Institut Yéo OK');

  // TOP IMMO — Agence Immobilière du Centre
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000080', restaurant_id: '30000000-0000-0000-0000-00000000000a', name: 'Appartements', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000081', restaurant_id: '30000000-0000-0000-0000-00000000000a', name: 'Maisons & Villas', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000082', restaurant_id: '30000000-0000-0000-0000-00000000000a', name: 'Terrains', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000090', restaurant_id: '30000000-0000-0000-0000-00000000000a', category_id: '40000000-0000-0000-0000-000000000080', name: 'Appartement F2', description: 'Salon, chambre, cuisine, douche — quartier résidentiel', base_price: 45000000, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000091', restaurant_id: '30000000-0000-0000-0000-00000000000a', category_id: '40000000-0000-0000-0000-000000000080', name: 'Appartement F4', description: '3 chambres, salon, cuisine américaine, 2 salles d\'eau', base_price: 85000000, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: ['visite'] },
    { id: '50000000-0000-0000-0000-000000000092', restaurant_id: '30000000-0000-0000-0000-00000000000a', category_id: '40000000-0000-0000-0000-000000000081', name: 'Villa 4 Pièces', description: 'Villa moderne avec piscine, jardin, garage 2 voitures', base_price: 120000000, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: ['visite'] },
    { id: '50000000-0000-0000-0000-000000000093', restaurant_id: '30000000-0000-0000-0000-00000000000a', category_id: '40000000-0000-0000-0000-000000000082', name: 'Terrain 500m²', description: 'Terrain viabilisé, zone en développement, titre foncier', base_price: 25000000, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000094', restaurant_id: '30000000-0000-0000-0000-00000000000a', category_id: '40000000-0000-0000-0000-000000000082', name: 'Terrain 1000m²', description: 'Grand terrain commercial, zone à forte croissance', base_price: 45000000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP IMMO — Agence Immobilière OK');

  // TOP EVENT — Kouamé Event
  await api('POST', 'menu_categories', [
    { id: '40000000-0000-0000-0000-000000000090', restaurant_id: '30000000-0000-0000-0000-00000000000b', name: 'Mariages', sort_order: 1 },
    { id: '40000000-0000-0000-0000-000000000091', restaurant_id: '30000000-0000-0000-0000-00000000000b', name: 'Séminaires', sort_order: 2 },
    { id: '40000000-0000-0000-0000-000000000092', restaurant_id: '30000000-0000-0000-0000-00000000000b', name: 'Animations', sort_order: 3 },
  ]);
  await api('POST', 'menu_items', [
    { id: '50000000-0000-0000-0000-000000000100', restaurant_id: '30000000-0000-0000-0000-00000000000b', category_id: '40000000-0000-0000-0000-000000000090', name: 'Pack Mariage Premium', description: 'Salle décorée, traiteur, DJ, photographe, animation — 100 personnes', base_price: 2500000, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000101', restaurant_id: '30000000-0000-0000-0000-00000000000b', category_id: '40000000-0000-0000-0000-000000000090', name: 'Pack Mariage Simple', description: 'Salle + traiteur — 50 personnes', base_price: 800000, image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000102', restaurant_id: '30000000-0000-0000-0000-00000000000b', category_id: '40000000-0000-0000-0000-000000000091', name: 'Séminaire 1 Jour', description: 'Salle climatisée, vidéoprojecteur, pause-café, déjeuner', base_price: 500000, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000103', restaurant_id: '30000000-0000-0000-0000-00000000000b', category_id: '40000000-0000-0000-0000-000000000092', name: 'DJ & Sonorisation', description: 'Sonorisation professionnelle + DJ — soirée, mariage, concert', base_price: 200000, image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
    { id: '50000000-0000-0000-0000-000000000104', restaurant_id: '30000000-0000-0000-0000-00000000000b', category_id: '40000000-0000-0000-0000-000000000092', name: 'Photographie & Vidéo', description: 'Photographe + vidéaste + album — couverture complète', base_price: 350000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', is_available: true, cooking_types: [], accompaniments: [] },
  ]);
  console.log('TOP EVENT — Kouamé Event OK');

  console.log('\n═══════════════════════════════════');
  console.log('✅ SEED TERMINÉ — 10 modules actifs');
  console.log('═══════════════════════════════════');
  console.log(`\n📊 ${restaurants.length} structures · 11 utilisateurs · 30+ catégories · 50+ produits/services`);
  console.log('\n🔑 Identifiants de test :');
  console.log('   mamadou@test.ci      / resto123 → Chez Tantie Marie (TOP DÉLICE)');
  console.log('   fatou@test.ci        / resto123 → Porc Braisé (TOP DÉLICE)');
  console.log('   kouame.hotel@test.ci / resto123 → Hôtel Les Palmiers (TOP HÔTEL)');
  console.log('   bamba.bat@test.ci    / resto123 → Bamba Construction (TOP BAT)');
  console.log('   amina.shop@test.ci   / resto123 → Aminata Beauty (TOP SHOP)');
  console.log('   toure.auto@test.ci   / resto123 → Touré Auto (TOP AUTO)');
  console.log('   konan.serv@test.ci   / resto123 → Konan Services (TOP SERVICES)');
  console.log('   docteur.sante@test.ci / resto123 → Cabinet Dr Kouassi (TOP SANTÉ)');
  console.log('   institut.edu@test.ci / resto123 → Institut Yéo (TOP ÉDUCATION)');
  console.log('   agence.immo@test.ci  / resto123 → Agence Immobilière (TOP IMMO)');
  console.log('   kouame.event@test.ci / resto123 → Kouamé Event (TOP EVENT)');
  console.log('   koffi@test.ci        / client123 → Client test');
}

main().catch(console.error);
