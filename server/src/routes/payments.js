import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';
import { createCheckoutSession, getCheckoutSession } from '../utils/wave.js';

const router = Router();

// POST /api/payments/initiate — Initier un paiement Wave pour une commande
router.post('/initiate', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id requis' });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (order.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    if (order.payment_status !== 'en_attente') {
      return res.status(400).json({ error: 'Paiement déjà effectué' });
    }

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const session = await createCheckoutSession({
      amount: order.deposit_amount,
      clientReference: order_id,
      successUrl: `${baseUrl}/payment/callback?order_id=${order_id}&status=success`,
      errorUrl: `${baseUrl}/payment/callback?order_id=${order_id}&status=cancel`,
    });

    // Enregistrer la référence de paiement
    await supabaseAdmin
      .from('orders')
      .update({ payment_reference: session.id })
      .eq('id', order_id);

    res.json({
      payment_url: session.wave_launch_url || null,
      session_id: session.id,
      amount: order.deposit_amount,
      mock: session.mock || false,
    });
  } catch (error) {
    console.error('Erreur init paiement:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation du paiement' });
  }
});

// GET /api/payments/status/:reference — Vérifier le statut d'un paiement
router.get('/status/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('payment_status, payment_reference')
      .eq('payment_reference', reference)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Référence non trouvée' });
    }

    res.json({
      payment_status: order.payment_status,
      payment_reference: order.payment_reference,
    });
  } catch (error) {
    console.error('Erreur status paiement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/payments/confirm — Confirmer un paiement (appelé par le frontend après callback)
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { order_id, session_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id requis' });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (order.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Vérifier le statut auprès de Wave (si mode réel)
    if (session_id && !session_id.startsWith('mock_')) {
      const session = await getCheckoutSession(session_id);
      if (session.status !== 'completed') {
        return res.status(400).json({ error: 'Paiement non confirmé par Wave' });
      }
    }

    // Marquer le paiement comme effectué
    await supabaseAdmin
      .from('orders')
      .update({ payment_status: 'avance_payee' })
      .eq('id', order_id);

    // Notifier le restaurateur
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('owner_id, name')
      .eq('id', order.restaurant_id)
      .single();

    if (restaurant) {
      await supabaseAdmin.from('notifications').insert({
        user_id: restaurant.owner_id,
        title: 'Paiement reçu',
        content: `Avance de ${order.deposit_amount.toLocaleString()} FCFA reçue pour la commande`,
        type: 'payment',
        link: `/restaurant/orders/${order.id}`,
      });
    }

    res.json({
      message: 'Paiement confirmé avec succès',
      payment_status: 'avance_payee',
    });
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
  }
});

export default router;
