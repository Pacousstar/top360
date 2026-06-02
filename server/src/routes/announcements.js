import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/announcements/:restaurantId
router.get('/:restaurantId', async (req, res) => {
  try {
    const { data: announcements, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('restaurant_id', req.params.restaurantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Erreur' });
    res.json({ announcements });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/announcements
router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurant_id, title, content, image } = req.body;

    if (!restaurant_id || !title) {
      return res.status(400).json({ error: 'restaurant_id et title requis' });
    }

    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .insert({ restaurant_id, title, content, image })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur création' });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await supabaseAdmin.from('announcements').delete().eq('id', req.params.id);
    res.json({ message: 'Annonce supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
