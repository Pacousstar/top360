import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate, generateToken } from '../middlewares/auth.js';

const router = Router();

// POST /api/auth/register — Inscription
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phone, password, role, module: selectedModule } = req.body;

    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe trop court (6 caractères minimum)' });
    }

    // Vérifier si l'email existe déjà
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const userRole = role === 'restaurant' ? 'restaurant' : 'client';

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        fullname,
        email,
        phone: phone || null,
        password_hash,
        role: userRole,
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création utilisateur:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }

    // Si c'est un restaurateur, créer automatiquement son restaurant
    let restaurant = null;
    if (userRole === 'restaurant') {
      const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: newRestaurant } = await supabaseAdmin.from('restaurants').insert({
        owner_id: user.id,
        name: fullname,
        slug: `${slug}-${Date.now()}`,
        module: selectedModule || 'top_delice',
      }).select().single();
      restaurant = newRestaurant;
    }

    // Générer le token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      restaurant,
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/auth/login — Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Chercher l'utilisateur
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Récupérer le restaurant si l'utilisateur est restaurateur
    let restaurant = null;
    if (user.role === 'restaurant') {
      const { data: resto } = await supabaseAdmin
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      restaurant = resto;
    }

    const token = generateToken(user);

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      restaurant,
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/auth/me — Profil actuel
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, fullname, email, phone, role, avatar, is_active, created_at')
      .eq('id', req.user.id)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    let restaurant = null;
    if (user.role === 'restaurant') {
      const { data: resto } = await supabaseAdmin
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single();
      restaurant = resto;
    }

    res.json({ user, restaurant });
  } catch (error) {
    console.error('Erreur me:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/auth/profile — Mettre à jour le profil
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullname, phone, avatar } = req.body;

    const updates = {};
    if (fullname) updates.fullname = fullname;
    if (phone !== undefined) updates.phone = phone;
    if (avatar) updates.avatar = avatar;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, fullname, email, phone, role, avatar')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Erreur mise à jour' });
    }

    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    console.error('Erreur update profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
