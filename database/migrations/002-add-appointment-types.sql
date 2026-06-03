-- Ajouter les nouveaux types pour les modules Hôtel, Bat, Auto
ALTER TYPE appointment_type ADD VALUE IF NOT EXISTS 'hotel';
ALTER TYPE appointment_type ADD VALUE IF NOT EXISTS 'bat';
ALTER TYPE appointment_type ADD VALUE IF NOT EXISTS 'auto';
