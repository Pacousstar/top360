-- ==========================================================
-- TOP 360° — SCHÉMA DE LA BASE DE DONNÉES SUPABASE
-- Version : 1.0.0
-- Date    : 01/06/2026
-- ==========================================================
-- Ce schéma définit l'intégralité de la structure de données
-- de la plateforme TOP 360° avec Row Level Security (RLS).
-- ==========================================================

-- ==========================================================
-- 1. EXTENSIONS
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 2. TYPES ÉNUMÉRÉS
-- ==========================================================
CREATE TYPE user_role AS ENUM ('client', 'restaurant', 'admin');
CREATE TYPE order_status AS ENUM ('en_attente', 'validee', 'preparation', 'pret', 'livree', 'annulee');
CREATE TYPE payment_status AS ENUM ('en_attente', 'avance_payee', 'payee', 'remboursee');
CREATE TYPE subscription_plan AS ENUM ('starter', 'business', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'expiree', 'suspendue', 'annulee');
CREATE TYPE module_type AS ENUM (
  'top_delice', 'top_bat', 'top_hotel', 'top_shop',
  'top_auto', 'top_sante', 'top_education', 'top_immo',
  'top_event', 'top_services'
);

-- ==========================================================
-- 3. TABLE: users
-- ==========================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fullname      TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'client',
  avatar        TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==========================================================
-- 4. TABLE: restaurants (structures)
-- ==========================================================
CREATE TABLE restaurants (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  module            module_type NOT NULL DEFAULT 'top_delice',
  logo              TEXT,
  banner            TEXT,
  phone             TEXT,
  address           TEXT,
  city              TEXT,
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  opening_time      TIME,
  closing_time      TIME,
  is_open           BOOLEAN DEFAULT false,
  is_verified       BOOLEAN DEFAULT false,
  is_featured       BOOLEAN DEFAULT false,
  subscription_plan subscription_plan,
  subscription_end  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_module ON restaurants(module);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_featured ON restaurants(is_featured) WHERE is_featured = true;
CREATE INDEX idx_restaurants_open ON restaurants(is_open) WHERE is_open = true;

-- ==========================================================
-- 5. TABLE: menu_categories
-- ==========================================================
CREATE TABLE menu_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id);

-- ==========================================================
-- 6. TABLE: menu_items (produits)
-- ==========================================================
CREATE TABLE menu_items (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id       UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  base_price        INTEGER NOT NULL,
  image             TEXT,
  is_available      BOOLEAN DEFAULT true,
  cooking_types     TEXT[] DEFAULT '{}',
  spice_levels      TEXT[] DEFAULT '{}',
  accompaniments    TEXT[] DEFAULT '{}',
  sort_order        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available) WHERE is_available = true;

-- ==========================================================
-- 7. TABLE: orders
-- ==========================================================
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  total_amount      INTEGER NOT NULL,
  deposit_amount    INTEGER NOT NULL DEFAULT 0,
  remaining_amount  INTEGER NOT NULL DEFAULT 0,
  status            order_status NOT NULL DEFAULT 'en_attente',
  pickup_time       TIMESTAMPTZ,
  payment_status    payment_status NOT NULL DEFAULT 'en_attente',
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ==========================================================
-- 8. TABLE: order_items
-- ==========================================================
CREATE TABLE order_items (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id            UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity                INTEGER NOT NULL DEFAULT 1,
  unit_price              INTEGER NOT NULL,
  selected_cooking_type   TEXT,
  selected_spice_level    TEXT,
  selected_accompaniment  TEXT,
  notes                   TEXT
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ==========================================================
-- 9. TABLE: announcements
-- ==========================================================
CREATE TABLE announcements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content       TEXT,
  image         TEXT,
  is_active     BOOLEAN DEFAULT true,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_announcements_restaurant ON announcements(restaurant_id);
CREATE INDEX idx_announcements_active ON announcements(is_active) WHERE is_active = true;

-- ==========================================================
-- 10. TABLE: subscriptions
-- ==========================================================
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  plan            subscription_plan NOT NULL,
  amount          INTEGER NOT NULL,
  start_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date        TIMESTAMPTZ NOT NULL,
  status          subscription_status NOT NULL DEFAULT 'active',
  auto_renew      BOOLEAN DEFAULT true,
  payment_method  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_restaurant ON subscriptions(restaurant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end ON subscriptions(end_date);

-- ==========================================================
-- 11. TABLE: sponsored_restaurants
-- ==========================================================
CREATE TABLE sponsored_restaurants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  start_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date        TIMESTAMPTZ NOT NULL,
  priority_level  INTEGER NOT NULL DEFAULT 1,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sponsored_restaurant ON sponsored_restaurants(restaurant_id);
CREATE INDEX idx_sponsored_active ON sponsored_restaurants(is_active) WHERE is_active = true;
CREATE INDEX idx_sponsored_priority ON sponsored_restaurants(priority_level DESC);

-- ==========================================================
-- 12. TABLE: reviews
-- ==========================================================
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  is_visible    BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_reviews_client ON reviews(client_id);

-- ==========================================================
-- 13. TABLE: notifications
-- ==========================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT,
  type        TEXT DEFAULT 'info',
  is_read     BOOLEAN DEFAULT false,
  link        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ==========================================================
-- 14. TABLE: favorites
-- ==========================================================
CREATE TABLE favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, restaurant_id)
);

CREATE INDEX idx_favorites_client ON favorites(client_id);

-- ==========================================================
-- 15. TABLE: stories
-- ==========================================================
CREATE TABLE stories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  media_url     TEXT NOT NULL,
  media_type    TEXT DEFAULT 'image',
  caption       TEXT,
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stories_restaurant ON stories(restaurant_id);
CREATE INDEX idx_stories_active ON stories(is_active) WHERE is_active = true;

-- ==========================================================
-- 16. FONCTIONS UTILITAIRES (déclarées AVANT les politiques RLS)
-- ==========================================================

-- Vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 17. ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 18. POLICIES RLS
-- ==========================================================

-- users: chacun voit/modifie son propre profil
CREATE POLICY users_select_self ON users FOR SELECT USING (auth.uid() = id OR role = 'admin');
CREATE POLICY users_update_self ON users FOR UPDATE USING (auth.uid() = id);

-- restaurants: lecture publique, écriture par propriétaire ou admin
CREATE POLICY restaurants_select_public ON restaurants FOR SELECT USING (true);
CREATE POLICY restaurants_insert_owner ON restaurants FOR INSERT WITH CHECK (auth.uid() = owner_id OR is_admin());
CREATE POLICY restaurants_update_owner ON restaurants FOR UPDATE USING (auth.uid() = owner_id OR is_admin());
CREATE POLICY restaurants_delete_admin ON restaurants FOR DELETE USING (is_admin());

-- menu_items: lecture publique
CREATE POLICY menu_items_select ON menu_items FOR SELECT USING (true);
CREATE POLICY menu_items_insert ON menu_items FOR INSERT WITH CHECK (auth.uid() IN (SELECT owner_id FROM restaurants WHERE id = restaurant_id));
CREATE POLICY menu_items_update ON menu_items FOR UPDATE USING (auth.uid() IN (SELECT owner_id FROM restaurants WHERE id = restaurant_id));

-- orders: lecture par client ou resto, écriture par client
CREATE POLICY orders_select ON orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (SELECT owner_id FROM restaurants WHERE id = restaurant_id));
CREATE POLICY orders_insert ON orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY orders_update_status ON orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() IN (SELECT owner_id FROM restaurants WHERE id = restaurant_id));

-- notifications: lecture par utilisateur concerné
CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Triggers pour updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================================
-- 19. DONNÉES DE TEST (SEED)
-- ==========================================================

-- Admin par défaut (mot de passe: admin123)
INSERT INTO users (id, fullname, email, phone, password_hash, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Super Admin TOP 360°',
  'admin@top360.ci',
  '+2250101020304',
  crypt('admin123', gen_salt('bf')),
  'admin'
);

-- Restaurants de test
INSERT INTO users (id, fullname, email, phone, password_hash, role) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Mamadou Koné', 'mamadou@test.ci', '+2250102030405', crypt('resto123', gen_salt('bf')), 'restaurant'),
  ('10000000-0000-0000-0000-000000000002', 'Fatou Diallo', 'fatou@test.ci', '+2250102030406', crypt('resto123', gen_salt('bf')), 'restaurant');

INSERT INTO restaurants (owner_id, name, slug, description, module, phone, city, latitude, longitude, is_open, is_verified, subscription_plan) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Chez Tantie Marie', 'chez-tantie-marie', 'Véritable cuisine locale traditionnelle', 'top_delice', '+2250102030405', 'Duékoué', 6.7419, -7.3486, true, true, 'business'),
  ('10000000-0000-0000-0000-000000000002', 'Porc Braisé du Carrefour', 'porc-braise-carrefour', 'Le meilleur porc braisé de la région', 'top_delice', '+2250102030406', 'Bangolo', 6.4850, -7.4120, true, true, 'starter');

-- Clients de test
INSERT INTO users (id, fullname, email, phone, password_hash, role) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Koffi Jean', 'koffi@test.ci', '+2250102030407', crypt('client123', gen_salt('bf')), 'client');

-- ==========================================================
-- FIN DU SCHÉMA
-- ==========================================================
