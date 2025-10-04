-- Ajouter la colonne location si elle n'existe pas
-- Cette colonne est utilisée pour stocker la géolocalisation des utilisateurs

-- Activer l'extension PostGIS si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS postgis;

-- Ajouter la colonne location si elle n'existe pas
ALTER TABLE utilisateurs 
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(Point, 4326);

-- Créer un index spatial pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_utilisateurs_location ON utilisateurs USING GIST(location);

-- Mise à jour des utilisateurs existants qui ont latitude et longitude
UPDATE utilisateurs 
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;
