import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/reviews/:restaurantId
router.get('/:restaurantId', async (req, res) => {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('*, client:client_id ( id, fullname, avatar )')
      .eq('restaurant_id', req.params.restaurantId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Erreur' });

    // Calculer la moyenne
    const ratings = reviews.map(r => r.rating);
    const avg = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;

    res.json({ reviews, avg_rating: avg, review_count: ratings.length });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/reviews
router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurant_id, rating, comment } = req.body;

    if (!restaurant_id || !rating) {
      return res.status(400).json({ error: 'restaurant_id et rating requis' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating doit être entre 1 et 5' });
    }

    // Vérifier si déjà noté
    const { data: existing } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('client_id', req.user.id)
      .eq('restaurant_id', restaurant_id)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Vous avez déjà noté ce restaurant' });
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        client_id: req.user.id,
        restaurant_id,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur création avis' });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
