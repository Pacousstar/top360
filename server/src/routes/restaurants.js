import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

// GET /api/restaurants — Liste des restaurants (avec filtres)
router.get('/', async (req, res) => {
  try {
    const {
      module,
      city,
      is_open,
      is_featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    let query = supabaseAdmin
      .from('restaurants')
      .select('*', { count: 'exact' });

    // Filtres
    if (module) query = query.eq('module', module);
    if (city) query = query.ilike('city', `%${city}%`);
    if (is_open === 'true') query = query.eq('is_open', true);
    if (is_featured === 'true') query = query.eq('is_featured', true);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: restaurants, error, count } = await query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Erreur liste restaurants:', error);
      return res.status(500).json({ error: 'Erreur lors du chargement des restaurants' });
    }

    // Récupérer les notes pour chaque restaurant
    const restaurantIds = restaurants.map(r => r.id);
    let ratingsMap = {};
    if (restaurantIds.length > 0) {
      const { data: reviews } = await supabaseAdmin
        .from('reviews')
        .select('restaurant_id, rating')
        .in('restaurant_id', restaurantIds);
      if (reviews) {
        reviews.forEach(rev => {
          if (!ratingsMap[rev.restaurant_id]) ratingsMap[rev.restaurant_id] = [];
          ratingsMap[rev.restaurant_id].push(rev.rating);
        });
      }
    }

    const enriched = restaurants.map(r => {
      const ratings = ratingsMap[r.id]?.filter(Boolean) || [];
      const avgRating = ratings.length
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;

      return {
        ...r,
        avg_rating: avgRating,
        review_count: ratings.length,
      };
    });

    res.json({
      restaurants: enriched,
      page: parseInt(page),
      limit: parseInt(limit),
      total: count || 0,
    });
  } catch (error) {
    console.error('Erreur restaurants:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/restaurants/:slug — Détail d'un restaurant
router.get('/:slug', async (req, res) => {
  try {
    const { data: restaurant, error } = await supabaseAdmin
      .from('restaurants')
      .select(`
        *,
        owner:owner_id ( fullname, phone, email, avatar ),
        menu_categories (
          *,
          menu_items (*)
        ),
        announcements (*)
      `)
      .eq('slug', req.params.slug)
      .single();

    if (error || !restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    // Récupérer les avis séparément
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('*, client:client_id ( fullname, avatar )')
      .eq('restaurant_id', restaurant.id)
      .order('created_at', { ascending: false });

    // Calculer la note moyenne
    const ratings = reviews?.map(r => r.rating).filter(Boolean) || [];
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;

    res.json({
      ...restaurant,
      reviews: reviews || [],
      avg_rating: avgRating,
      review_count: ratings.length,
    });
  } catch (error) {
    console.error('Erreur détail restaurant:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/restaurants/:id — Mettre à jour le restaurant
router.put('/:id', authenticate, async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Vérifier que l'utilisateur est propriétaire
    const { data: existing } = await supabaseAdmin
      .from('restaurants')
      .select('owner_id')
      .eq('id', restaurantId)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    if (existing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const {
      name, description, phone, address, city,
      latitude, longitude, opening_time, closing_time,
      is_open, logo, banner, module,
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (phone) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (city) updates.city = city;
    if (latitude) updates.latitude = latitude;
    if (longitude) updates.longitude = longitude;
    if (opening_time) updates.opening_time = opening_time;
    if (closing_time) updates.closing_time = closing_time;
    if (is_open !== undefined) updates.is_open = is_open;
    if (logo) updates.logo = logo;
    if (banner) updates.banner = banner;
    if (module) updates.module = module;

    const { data: restaurant, error } = await supabaseAdmin
      .from('restaurants')
      .update(updates)
      .eq('id', restaurantId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Erreur mise à jour' });
    }

    res.json({ message: 'Restaurant mis à jour', restaurant });
  } catch (error) {
    console.error('Erreur update restaurant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/restaurants/:id/toggle-open — Ouvrir/fermer
router.patch('/:id/toggle-open', authenticate, async (req, res) => {
  try {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('owner_id, is_open')
      .eq('id', req.params.id)
      .single();

    if (!restaurant) return res.status(404).json({ error: 'Restaurant non trouvé' });
    if (restaurant.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { data: updated } = await supabaseAdmin
      .from('restaurants')
      .update({ is_open: !restaurant.is_open })
      .eq('id', req.params.id)
      .select()
      .single();

    res.json({
      message: updated.is_open ? 'Restaurant ouvert' : 'Restaurant fermé',
      is_open: updated.is_open,
    });
  } catch (error) {
    console.error('Erreur toggle open:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
