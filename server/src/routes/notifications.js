import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/notifications — Mes notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: 'Erreur' });

    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    res.json({ notifications, unread_count: unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/notifications/:id/read — Marquer comme lu
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/notifications/read-all — Tout marquer comme lu
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
