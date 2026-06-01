import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/subscriptions/:restaurantId — Abonnement d'un restaurant
router.get('/:restaurantId', authenticate, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('restaurant_id', req.params.restaurantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Erreur chargement abonnement' });
    }

    res.json({ subscription: subscription || null });
  } catch (error) {
    console.error('Erreur sub:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/subscriptions — Souscrire à un abonnement
router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurant_id, plan } = req.body;

    const plans = {
      starter: { amount: 3000, duration: 30 },
      business: { amount: 7500, duration: 30 },
      premium: { amount: 15000, duration: 30 },
    };

    if (!plans[plan]) {
      return res.status(400).json({ error: 'Plan invalide (starter, business, premium)' });
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + plans[plan].duration);

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        restaurant_id,
        plan,
        amount: plans[plan].amount,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur souscription' });

    // Mettre à jour le restaurant
    await supabase
      .from('restaurants')
      .update({
        subscription_plan: plan,
        subscription_end: endDate.toISOString(),
      })
      .eq('id', restaurant_id);

    res.status(201).json({
      message: `Abonnement ${plan} activé`,
      subscription,
    });
  } catch (error) {
    console.error('Erreur subscribe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/subscriptions/check/:restaurantId — Vérifier abonnement actif
router.get('/check/:restaurantId', async (req, res) => {
  try {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('restaurant_id', req.params.restaurantId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const isActive = sub && new Date(sub.end_date) > new Date();

    res.json({ is_active: !!isActive, subscription: sub || null });
  } catch (error) {
    res.json({ is_active: false, subscription: null });
  }
});

export default router;
