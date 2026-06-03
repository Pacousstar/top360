import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

// Toutes les routes admin nécessitent le rôle admin
router.use(authenticate);
router.use(requireRole('admin'));

// GET /api/admin/dashboard — Statistiques globales
router.get('/dashboard', async (req, res) => {
  try {
    const [
      { count: totalRestaurants },
      { count: totalClients },
      { count: totalOrders },
      { count: activeSubscriptions },
      { count: totalRevenue },
      { count: pendingOrders },
    ] = await Promise.all([
      supabaseAdmin.from('restaurants').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('subscriptions').select('amount', { count: 'exact' }).eq('status', 'active'),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).in('status', ['en_attente', 'validee']),
    ]);

    // Calculer les revenus mensuels estimés
    const totalRevenueAmount = totalRevenue?.data?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

    // Dernières inscriptions
    const { data: recentRestaurants } = await supabaseAdmin
      .from('restaurants')
      .select('*, owner:owner_id ( fullname, email )')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      stats: {
        total_restaurants: totalRestaurants || 0,
        total_clients: totalClients || 0,
        total_orders: totalOrders || 0,
        active_subscriptions: activeSubscriptions || 0,
        monthly_revenue: totalRevenueAmount,
        pending_orders: pendingOrders || 0,
      },
      recent_restaurants: recentRestaurants || [],
    });
  } catch (error) {
    console.error('Erreur admin dashboard:', error);
    res.status(500).json({ error: 'Erreur chargement dashboard' });
  }
});

// GET /api/admin/restaurants — Liste tous les restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const { page = 1, limit = 20, module, is_verified } = req.query;

    let query = supabaseAdmin
      .from('restaurants')
      .select('*, owner:owner_id ( fullname, email, phone )')
      .order('created_at', { ascending: false });

    if (module) query = query.eq('module', module);
    if (is_verified !== undefined) query = query.eq('is_verified', is_verified === 'true');

    const from = (page - 1) * limit;
    const { data: restaurants, error } = await query.range(from, from + limit - 1);

    if (error) return res.status(500).json({ error: 'Erreur chargement' });

    res.json({ restaurants });
  } catch (error) {
    console.error('Erreur admin restaurants:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/restaurants/:id/verify — Vérifier un restaurant
router.put('/restaurants/:id/verify', async (req, res) => {
  try {
    const { data: restaurant, error } = await supabaseAdmin
      .from('restaurants')
      .update({ is_verified: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur vérification' });

    res.json({ message: 'Restaurant vérifié', restaurant });
  } catch (error) {
    console.error('Erreur verify:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/restaurants/:id/toggle-active — Activer/suspendre
router.put('/restaurants/:id/toggle-active', async (req, res) => {
  try {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('is_verified')
      .eq('id', req.params.id)
      .single();

    const { data: updated, error } = await supabaseAdmin
      .from('restaurants')
      .update({ is_verified: !restaurant.is_verified })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur' });

    res.json({
      message: updated.is_verified ? 'Restaurant activé' : 'Restaurant suspendu',
      restaurant: updated,
    });
  } catch (error) {
    console.error('Erreur toggle active:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/subscriptions — Gérer abonnements
router.get('/subscriptions', async (req, res) => {
  try {
    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*, restaurant:restaurant_id ( name, slug, owner_id )')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: 'Erreur chargement' });

    res.json({ subscriptions });
  } catch (error) {
    console.error('Erreur admin subs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/appointments — Tous les rendez-vous
router.get('/appointments', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('appointments')
      .select('*, restaurant:restaurant_id ( id, name, slug, module, owner_id )')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    const from = (page - 1) * limit;
    const { data: appointments, error, count } = await query.range(from, from + limit - 1);

    if (error) return res.status(500).json({ error: 'Erreur chargement' });

    res.json({ appointments, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error('Erreur admin appointments:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/users — Liste utilisateurs
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('users')
      .select('id, fullname, email, phone, role, is_active, created_at')
      .order('created_at', { ascending: false });

    if (role) query = query.eq('role', role);

    const from = (page - 1) * limit;
    const { data: users, error } = await query.range(from, from + limit - 1);

    if (error) return res.status(500).json({ error: 'Erreur chargement' });

    res.json({ users });
  } catch (error) {
    console.error('Erreur admin users:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
