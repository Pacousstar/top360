import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import menuRoutes from './routes/menus.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import subscriptionRoutes from './routes/subscriptions.js';
import announcementRoutes from './routes/announcements.js';
import reviewRoutes from './routes/reviews.js';
import notificationRoutes from './routes/notifications.js';
import searchRoutes from './routes/search.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payments.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globaux
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, réessayez plus tard.' },
});
app.use('/api/', limiter);

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TOP 360°',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.message, err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur', details: err.message });
});

app.listen(PORT, () => {
  console.log(`
═══════════════════════════════════════════
  TOP 360° API — Serveur démarré
  Port : ${PORT}
  Environnement : ${process.env.NODE_ENV || 'development'}
  Date : ${new Date().toLocaleString('fr-FR')}
═══════════════════════════════════════════
  `);
});
