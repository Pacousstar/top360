import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/orders — Liste des commandes (client ou restaurateur)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        client:client_id ( id, fullname, phone ),
        restaurant:restaurant_id ( id, name, slug, logo ),
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    // Filtrer selon le rôle
    if (req.user.role === 'client') {
      query = query.eq('client_id', req.user.id);
    } else if (req.user.role === 'restaurant') {
      const { data: restaurants } = await supabaseAdmin
        .from('restaurants')
        .select('id')
        .eq('owner_id', req.user.id);

      const restaurantIds = restaurants?.map(r => r.id) || [];
      if (restaurantIds.length === 0) {
        return res.json({ orders: [], page: 1, limit: 20 });
      }
      query = query.in('restaurant_id', restaurantIds);
    }

    if (status) query = query.eq('status', status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: orders, error } = await query.range(from, to);

    if (error) {
      console.error('Erreur list orders:', error);
      return res.status(500).json({ error: 'Erreur chargement commandes' });
    }

    res.json({ orders, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error('Erreur orders:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/orders — Créer une commande
router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurant_id, items, pickup_time, notes, deposit_amount } = req.body;

    if (!restaurant_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'restaurant_id et items requis' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Seuls les clients peuvent commander' });
    }

    // Calculer le total
    let total_amount = 0;
    for (const item of items) {
      const { data: menuItem } = await supabaseAdmin
        .from('menu_items')
        .select('base_price')
        .eq('id', item.menu_item_id)
        .single();

      if (!menuItem) {
        return res.status(404).json({ error: `Plat ${item.menu_item_id} non trouvé` });
      }

      total_amount += menuItem.base_price * (item.quantity || 1);
    }

    // Calculer l'avance (30% par défaut, ou montant personnalisé)
    const deposit = deposit_amount || Math.round(total_amount * 0.3);
    const remaining = total_amount - deposit;

    // Créer la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        client_id: req.user.id,
        restaurant_id,
        total_amount,
        deposit_amount: deposit,
        remaining_amount: remaining,
        pickup_time: pickup_time || null,
        notes: notes || null,
        status: 'en_attente',
        payment_status: 'en_attente',
        payment_reference: null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Erreur création commande:', orderError);
      return res.status(500).json({ error: 'Erreur création commande' });
    }

    // Créer les items de la commande
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      selected_cooking_type: item.cooking_type || null,
      selected_spice_level: item.spice_level || null,
      selected_accompaniment: item.accompaniment || null,
      notes: item.notes || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Erreur création items commande:', itemsError);
      return res.status(500).json({ error: 'Erreur création items' });
    }

    // Notification au restaurateur
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('owner_id, name')
      .eq('id', restaurant_id)
      .single();

    if (restaurant) {
      await supabaseAdmin.from('notifications').insert({
        user_id: restaurant.owner_id,
        title: 'Nouvelle commande',
        content: `Nouvelle commande de ${total_amount.toLocaleString()} FCFA chez ${restaurant.name}`,
        type: 'order',
        link: `/restaurant/orders/${order.id}`,
      });
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: {
        ...order,
        total_amount,
        deposit_amount: deposit,
        remaining_amount: remaining,
      },
      requires_payment: deposit > 0,
    });
  } catch (error) {
    console.error('Erreur create order:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/orders/:id/status — Mettre à jour le statut
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['en_attente', 'validee', 'preparation', 'pret', 'livree', 'annulee'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

    // Vérifier permissions
    if (req.user.role === 'client' && status !== 'annulee') {
      return res.status(403).json({ error: 'Vous ne pouvez qu\'annuler votre commande' });
    }

    const { data: updated } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    // Notifier le client
    if (status !== 'annulee') {
      await supabaseAdmin.from('notifications').insert({
        user_id: order.client_id,
        title: 'Commande mise à jour',
        content: `Votre commande est maintenant : ${status}`,
        type: 'order',
        link: `/client/orders/${order.id}`,
      });
    }

    res.json({ message: `Statut mis à jour : ${status}`, order: updated });
  } catch (error) {
    console.error('Erreur update status:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders/:id — Détail d'une commande
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        client:client_id ( id, fullname, phone ),
        restaurant:restaurant_id ( id, name, slug, logo, phone, address, city ),
        order_items (
          *,
          menu_item:menu_item_id ( name, image, base_price )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Vérifier accès
    const isClient = order.client_id === req.user.id;
    const isOwner = req.user.role === 'restaurant' && (
      await supabaseAdmin.from('restaurants').select('owner_id').eq('id', order.restaurant_id).single()
    ).data?.owner_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur order detail:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
