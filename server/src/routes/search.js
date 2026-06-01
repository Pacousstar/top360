import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/search — Recherche intelligente
router.get('/', async (req, res) => {
  try {
    const { q, module, city, is_open } = req.query;

    if (!q && !module && !city) {
      return res.status(400).json({ error: 'Paramètre de recherche requis (q, module, city)' });
    }

    let query = supabase
      .from('restaurants')
      .select(`
        *,
        reviews:reviews ( rating )
      `);

    if (q) {
      query = query.or(
        `name.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%`
      );
    }

    if (module) query = query.eq('module', module);
    if (city) query = query.ilike('city', `%${city}%`);
    if (is_open === 'true') query = query.eq('is_open', true);

    query = query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: results, error } = await query;

    if (error) {
      console.error('Erreur search:', error);
      return res.status(500).json({ error: 'Erreur recherche' });
    }

    // Enrichir avec les notes
    const enriched = results.map(r => {
      const ratings = r.reviews?.map(rev => rev.rating).filter(Boolean) || [];
      const avgRating = ratings.length
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;
      return { ...r, avg_rating: avgRating, review_count: ratings.length };
    });

    res.json({ results: enriched, count: enriched.length });
  } catch (error) {
    console.error('Erreur search:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
