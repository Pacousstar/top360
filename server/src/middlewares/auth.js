import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'top360-secret-dev';

// Vérifie le token JWT et attache l'utilisateur à req.user
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Récupérer l'utilisateur depuis Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Vérifie que l'utilisateur a un rôle spécifique
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Accès réservé aux rôles: ${roles.join(', ')}` });
    }
    next();
  };
};

// Génère un token JWT
export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
