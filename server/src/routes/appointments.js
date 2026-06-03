import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// POST /api/appointments — Créer une réservation (public ou client connecté)
router.post('/', async (req, res) => {
  try {
    const { restaurant_id, type, item_name, client_name, client_phone, client_email, preferred_date, preferred_time, message, guests, niveau, motif } = req.body;

    if (!restaurant_id || !type || !item_name || !client_name || !client_phone) {
      return res.status(400).json({ error: 'restaurant_id, type, item_name, client_name et client_phone requis' });
    }

    const validTypes = ['service', 'sante', 'education', 'immo', 'event', 'hotel', 'bat', 'auto'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }

    // Vérifier que le restaurant existe
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id, owner_id, name')
      .eq('id', restaurant_id)
      .single();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        restaurant_id,
        type,
        item_name,
        client_name,
        client_phone,
        client_email: client_email || null,
        preferred_date: preferred_date || null,
        preferred_time: preferred_time || null,
        message: message || null,
        guests: guests || null,
        niveau: niveau || null,
        motif: motif || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création réservation:', error);
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }

    // Notifier le restaurateur
    await supabaseAdmin.from('notifications').insert({
      user_id: restaurant.owner_id,
      title: 'Nouvelle réservation',
      content: `${client_name} a réservé ${item_name} chez ${restaurant.name}`,
      type: 'appointment',
      link: `/restaurant/appointments`,
    });

    res.status(201).json({ message: 'Réservation envoyée avec succès', appointment });
  } catch (error) {
    console.error('Erreur create appointment:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/appointments — Liste des réservations (restaurateur seulement)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, type: filterType, page = 1, limit = 50 } = req.query;

    const { data: restaurants } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('owner_id', req.user.id);

    const restaurantIds = restaurants?.map(r => r.id) || [];

    if (restaurantIds.length === 0) {
      return res.json({ appointments: [], page: 1, limit: 50 });
    }

    let query = supabaseAdmin
      .from('appointments')
      .select('*')
      .in('restaurant_id', restaurantIds)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (filterType) query = query.eq('type', filterType);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: appointments, error } = await query.range(from, to);

    if (error) {
      console.error('Erreur list appointments:', error);
      return res.status(500).json({ error: 'Erreur chargement' });
    }

    res.json({ appointments, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error('Erreur appointments:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/appointments/:id/status — Mettre à jour le statut
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['en_attente', 'confirme', 'refuse', 'annule'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const { data: appointment, error: findError } = await supabaseAdmin
      .from('appointments')
      .select('*, restaurants!inner(owner_id)')
      .eq('id', req.params.id)
      .single();

    if (findError || !appointment) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (appointment.restaurants.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur update status:', error);
      return res.status(500).json({ error: 'Erreur mise à jour' });
    }

    res.json({ message: `Statut mis à jour : ${status}`, appointment: updated });
  } catch (error) {
    console.error('Erreur update appointment:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
