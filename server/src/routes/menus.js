import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/menus/:restaurantId — Menu complet d'un restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('menu_categories')
      .select(`
        *,
        menu_items (*)
      `)
      .eq('restaurant_id', req.params.restaurantId)
      .order('sort_order');

    if (error) {
      return res.status(500).json({ error: 'Erreur chargement menu' });
    }

    res.json({ categories });
  } catch (error) {
    console.error('Erreur menus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/menus/category — Ajouter une catégorie
router.post('/category', authenticate, async (req, res) => {
  try {
    const { restaurant_id, name } = req.body;

    if (!restaurant_id || !name) {
      return res.status(400).json({ error: 'restaurant_id et name requis' });
    }

    const { data: category, error } = await supabaseAdmin
      .from('menu_categories')
      .insert({ restaurant_id, name })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur création catégorie' });

    res.status(201).json(category);
  } catch (error) {
    console.error('Erreur create category:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/menus/category/:id — Modifier une catégorie
router.put('/category/:id', authenticate, async (req, res) => {
  try {
    const { data: category, error } = await supabaseAdmin
      .from('menu_categories')
      .update({ name: req.body.name })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur modification' });

    res.json(category);
  } catch (error) {
    console.error('Erreur update category:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/menus/category/:id — Supprimer une catégorie
router.delete('/category/:id', authenticate, async (req, res) => {
  try {
    await supabaseAdmin.from('menu_categories').delete().eq('id', req.params.id);
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    console.error('Erreur delete category:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/menus/item — Ajouter un plat/produit
router.post('/item', authenticate, async (req, res) => {
  try {
    const {
      restaurant_id, category_id, name, description,
      base_price, image, cooking_types, spice_levels, accompaniments,
    } = req.body;

    if (!restaurant_id || !name || !base_price) {
      return res.status(400).json({ error: 'restaurant_id, name et base_price requis' });
    }

    const { data: item, error } = await supabaseAdmin
      .from('menu_items')
      .insert({
        restaurant_id,
        category_id: category_id || null,
        name,
        description: description || '',
        base_price: parseInt(base_price),
        image: image || null,
        cooking_types: cooking_types || [],
        spice_levels: spice_levels || [],
        accompaniments: accompaniments || [],
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur création plat' });

    res.status(201).json(item);
  } catch (error) {
    console.error('Erreur create item:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/menus/item/:id — Modifier un plat
router.put('/item/:id', authenticate, async (req, res) => {
  try {
    const {
      name, description, base_price, image,
      is_available, cooking_types, spice_levels, accompaniments, category_id,
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (base_price) updates.base_price = parseInt(base_price);
    if (image !== undefined) updates.image = image;
    if (is_available !== undefined) updates.is_available = is_available;
    if (cooking_types) updates.cooking_types = cooking_types;
    if (spice_levels) updates.spice_levels = spice_levels;
    if (accompaniments) updates.accompaniments = accompaniments;
    if (category_id !== undefined) updates.category_id = category_id;

    const { data: item, error } = await supabaseAdmin
      .from('menu_items')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Erreur modification plat' });

    res.json(item);
  } catch (error) {
    console.error('Erreur update item:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/menus/item/:id/toggle — Activer/désactiver un plat
router.patch('/item/:id/toggle', authenticate, async (req, res) => {
  try {
    const { data: item } = await supabaseAdmin
      .from('menu_items')
      .select('is_available')
      .eq('id', req.params.id)
      .single();

    const { data: updated } = await supabaseAdmin
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', req.params.id)
      .select()
      .single();

    res.json(updated);
  } catch (error) {
    console.error('Erreur toggle item:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/menus/item/:id — Supprimer un plat
router.delete('/item/:id', authenticate, async (req, res) => {
  try {
    await supabaseAdmin.from('menu_items').delete().eq('id', req.params.id);
    res.json({ message: 'Plat supprimé' });
  } catch (error) {
    console.error('Erreur delete item:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
