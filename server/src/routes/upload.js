import { Router } from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporté (JPEG, PNG, WebP, GIF uniquement)'), false);
    }
  },
});

// POST /api/upload — Upload image
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier requis' });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${req.file.mimetype.split('/')[1]}`;

    const { data, error } = await supabaseAdmin.storage
      .from('top360-uploads')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Erreur upload Supabase:', error);
      return res.status(500).json({ error: "Erreur lors de l'upload" });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('top360-uploads')
      .getPublicUrl(fileName);

    res.json({
      url: publicUrl,
      filename: fileName,
    });
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
