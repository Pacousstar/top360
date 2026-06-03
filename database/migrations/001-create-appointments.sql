-- ==========================================================
-- MIGRATION: Créer la table appointments
-- ==========================================================
-- Exécuter cette requête dans Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ==========================================================

-- Créer les types ENUM (avec vérification pour être idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_type') THEN
    CREATE TYPE appointment_type AS ENUM ('service', 'sante', 'education', 'immo', 'event');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('en_attente', 'confirme', 'refuse', 'annule');
  END IF;
END $$;

-- Créer la table
CREATE TABLE IF NOT EXISTS appointments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id     UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  type              appointment_type NOT NULL,
  item_name         TEXT NOT NULL,
  client_name       TEXT NOT NULL,
  client_phone      TEXT NOT NULL,
  client_email      TEXT,
  preferred_date    DATE,
  preferred_time    TIME,
  message           TEXT,
  guests            INTEGER,
  niveau            TEXT,
  motif             TEXT,
  status            appointment_status NOT NULL DEFAULT 'en_attente',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_appointments_restaurant ON appointments(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
