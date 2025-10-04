# 🚀 Guide Rapide : Créer les Tables dans Supabase

## ⚡ Étapes Rapides (5 minutes)

### 1️⃣ Ouvrir Supabase SQL Editor

1. Aller sur : https://supabase.com/dashboard
2. Sélectionner votre projet **"artu-karangue"** (ou le nom que vous avez choisi)
3. Dans le menu à gauche, cliquer sur **"SQL Editor"**
4. Cliquer sur **"New query"**

---

### 2️⃣ Copier le Script SQL

**Copier tout le script ci-dessous** (Ctrl+A puis Ctrl+C) :

```sql
-- ================================
-- ARTU SI SEN KARANGUE - Database Schema
-- Tables pour l'application d'urgence
-- ================================

-- Table Utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'responder', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    profile_image VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Table Urgences
CREATE TABLE urgences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('medical', 'fire', 'police', 'accident', 'other')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'in_progress', 'resolved', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    responder_id INTEGER REFERENCES utilisateurs(id),
    audio_url VARCHAR(500),
    video_url VARCHAR(500),
    photos JSONB DEFAULT '[]'
);

-- Table Messages (Chat)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    urgence_id INTEGER REFERENCES urgences(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT false
);

-- Table Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    urgence_id INTEGER REFERENCES urgences(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB
);

-- Table Posts Communauté
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'alert', 'info', 'help')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    images JSONB DEFAULT '[]',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Table Commentaires
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Likes
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_urgences_user_id ON urgences(user_id);
CREATE INDEX idx_urgences_status ON urgences(status);
CREATE INDEX idx_urgences_created_at ON urgences(created_at DESC);
CREATE INDEX idx_messages_urgence_id ON messages(urgence_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_user ON likes(post_id, user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_urgences_updated_at BEFORE UPDATE ON urgences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Extension PostGIS pour les données géographiques (optionnel)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Tables créées avec succès pour ARTU SI SEN KARANGUE !';
END $$;
```

---

### 3️⃣ Exécuter le Script

1. **Coller** le script dans l'éditeur SQL de Supabase (Ctrl+V)
2. Cliquer sur le bouton **"Run"** (en bas à droite) ou appuyer sur **Ctrl+Enter**
3. Attendre quelques secondes

**Résultat attendu :**
```
Success. No rows returned.
```

---

### 4️⃣ Vérifier les Tables

1. Dans le menu à gauche, cliquer sur **"Table Editor"**
2. Vous devriez voir toutes vos tables :
   - ✅ utilisateurs
   - ✅ urgences
   - ✅ messages
   - ✅ notifications
   - ✅ posts
   - ✅ comments
   - ✅ likes

---

## 🎉 C'est terminé !

Vos tables sont maintenant créées dans Supabase !

### 📋 Prochaine Étape

**Configurer le backend pour se connecter à Supabase :**

```powershell
cd backend
.\setup-supabase.ps1
```

Ce script va :
1. Vous demander votre mot de passe Supabase
2. Mettre à jour le fichier `.env`
3. Tester la connexion

---

## 🔍 Retrouver votre Mot de Passe Supabase

Si vous avez oublié le mot de passe :

1. **Supabase Dashboard** → Sélectionner votre projet
2. **Settings** → **Database**
3. Chercher **"Database Password"**
4. Cliquer sur **"Reset database password"**
5. **Copier le nouveau mot de passe** (vous ne pourrez plus le voir !)

---

## 💡 Astuce

**Voir la Connection String complète :**

1. **Settings** → **Database**
2. Chercher **"Connection string"**
3. Sélectionner **"URI"**
4. Copier :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres
   ```

Remplacer `[YOUR-PASSWORD]` par votre vrai mot de passe.

---

## ❓ Problèmes Courants

### Erreur : "relation already exists"
➡️ Les tables existent déjà. Rien à faire !

### Erreur : "permission denied"
➡️ Vérifier que vous utilisez le bon projet Supabase.

### Tables invisibles dans Table Editor
➡️ Rafraîchir la page (F5).

---

**Besoin d'aide ?** Consultez : https://supabase.com/docs
