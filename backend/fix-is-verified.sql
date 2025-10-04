-- Ajouter la colonne is_verified manquante
-- Executez dans Supabase SQL Editor

ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
