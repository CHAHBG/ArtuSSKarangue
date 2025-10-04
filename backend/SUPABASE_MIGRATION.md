# 🌐 Migration vers Supabase - Guide Complet

## 📋 Vue d'Ensemble

**Supabase** = PostgreSQL en ligne + Auth + Realtime + Storage

**Avantages :**
- ✅ Gratuit jusqu'à 500 MB
- ✅ Compatible PostgreSQL 100%
- ✅ Pas besoin d'installer PostgreSQL localement
- ✅ Accessible depuis n'importe où
- ✅ Auth intégrée (optionnel)
- ✅ Dashboard web pour gérer la DB

---

## 🎯 Étape 1 : Créer un Compte Supabase

### 1.1 S'inscrire

1. Aller sur : https://supabase.com
2. Cliquer sur **"Start your project"**
3. S'inscrire avec GitHub ou Email
4. **Gratuit, pas de carte de crédit requise**

### 1.2 Créer un Projet

1. Cliquer sur **"New Project"**
2. Remplir :
   - **Name :** artu-karangue
   - **Database Password :** Créer un mot de passe fort (NOTEZ-LE !)
   - **Region :** Choisir le plus proche (Europe West ou US East)
3. Cliquer sur **"Create new project"**
4. Attendre 2-3 minutes (création de la DB)

---

## 🗄️ Étape 2 : Créer les Tables

### 2.1 Ouvrir SQL Editor

1. Dans Supabase Dashboard → Aller sur **SQL Editor**
2. Cliquer sur **"New query"**

### 2.2 Exécuter le Script SQL

Copier-coller ce script complet :

```sql
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
```

3. Cliquer sur **"Run"** (en bas à droite)
4. Vérifier : "Success. No rows returned"

---

## 🔑 Étape 3 : Obtenir les Credentials

### 3.1 Connexion String

1. Dans Supabase Dashboard → **Settings** → **Database**
2. Chercher **"Connection string"**
3. Sélectionner **"URI"**
4. Copier l'URI complète :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 3.2 API Keys (Optionnel)

Si vous voulez utiliser l'API Supabase directement :
1. **Settings** → **API**
2. Copier :
   - `anon` / `public` key
   - `service_role` key
   - Project URL

---

## ⚙️ Étape 4 : Configurer le Backend

### 4.1 Modifier `backend/.env`

```env
# Database Configuration
DATABASE_HOST=db.xxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=VOTRE_MOT_DE_PASSE_SUPABASE

# Ou utiliser directement l'URI
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=votre_secret_jwt_32_caracteres
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Redis (optionnel)
REDIS_ENABLED=false

# CORS
CORS_ORIGIN=*
```

### 4.2 Modifier `backend/src/config/database.js`

Si vous utilisez `DATABASE_URL` :

```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Support pour DATABASE_URL ou variables séparées
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Important pour Supabase
  }
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connected to Supabase PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on database client', err);
  process.exit(-1);
});

module.exports = pool;
```

---

## 🧪 Étape 5 : Tester la Connexion

### 5.1 Redémarrer le Backend

```powershell
cd backend
node src/server.js
```

**Vous devriez voir :**
```
✅ Connected to Supabase PostgreSQL
✅ Redis connected
🚀 Server running on port 5000
```

### 5.2 Créer un Utilisateur Test

```powershell
$body = @{
    nom = "Test"
    prenom = "User"
    telephone = "+221771234567"
    email = "test@test.com"
    password = "Test123!"
    role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 5.3 Vérifier dans Supabase

1. Dashboard → **Table Editor**
2. Table **utilisateurs**
3. Vous devriez voir votre utilisateur !

---

## 📱 Étape 6 : Configuration Mobile (Aucun Changement)

**Rien à changer !** Votre app mobile continue de pointer vers :
```env
API_URL=http://192.168.1.9:5000/api/v1
```

Le backend gère maintenant Supabase au lieu de PostgreSQL local.

---

## 🎯 Avantages de Supabase

### 1. Accessible Partout
```
Avant: Backend local uniquement
Après: Backend accessible depuis n'importe où
```

### 2. Pas d'Installation PostgreSQL
```
Avant: Installer PostgreSQL, pgAdmin, etc.
Après: Tout en ligne, rien à installer
```

### 3. Dashboard Web
```
- Voir les données en temps réel
- Exécuter des requêtes SQL
- Gérer les utilisateurs
- Voir les logs
```

### 4. Backup Automatique
```
- Sauvegardes quotidiennes
- Point-in-time recovery
- Haute disponibilité
```

### 5. Évolutif
```
Plan gratuit: 500 MB
Plan Pro: 8 GB ($25/mois)
Plan Team: 200 GB ($125/mois)
```

---

## 🔒 Sécurité

### Row Level Security (RLS)

Supabase recommande d'activer RLS pour sécuriser les données :

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE urgences ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs ne voient que leurs données
CREATE POLICY "Users can view own data" ON utilisateurs
  FOR SELECT USING (auth.uid() = id::text);

-- Politique : Tout le monde peut voir les urgences actives
CREATE POLICY "Anyone can view active urgences" ON urgences
  FOR SELECT USING (status != 'cancelled');
```

**Note :** Comme vous utilisez votre propre backend avec JWT, vous pouvez gérer la sécurité côté API.

---

## 🚀 Déployer le Backend (Optionnel)

### Option 1 : Railway (Gratuit 500h/mois)

1. Aller sur https://railway.app
2. "Start a New Project"
3. Connecter GitHub
4. Sélectionner votre repo
5. Railway détecte Node.js automatiquement
6. Variables d'environnement :
   - DATABASE_URL (Supabase)
   - JWT_SECRET
   - NODE_ENV=production

### Option 2 : Render (Gratuit)

1. https://render.com
2. "New Web Service"
3. Connecter GitHub
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && node src/server.js`

---

## 📋 Checklist Migration

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Tables créées (SQL exécuté)
- [ ] Credentials copiés
- [ ] `backend/.env` mis à jour
- [ ] `database.js` modifié (SSL enabled)
- [ ] Backend redémarré
- [ ] Connexion testée
- [ ] Utilisateur test créé
- [ ] Données visibles dans Supabase Dashboard

---

## 🎉 Résultat Final

**Avant :**
```
PC → Backend → PostgreSQL Local
```

**Après :**
```
PC → Backend → Supabase (PostgreSQL Cloud)
Téléphone → Backend → Supabase
N'importe où → Backend → Supabase
```

---

## 💡 Prochaines Étapes

1. **Maintenant :** Migrer vers Supabase (local)
2. **Après :** Déployer le backend sur Railway/Render
3. **Ensuite :** Utiliser l'URL du backend déployé dans l'app mobile
4. **Résultat :** App complètement en ligne, accessible partout !

---

## 📞 Support

**Supabase Docs :** https://supabase.com/docs  
**Supabase Community :** https://github.com/supabase/supabase/discussions

---

**Voulez-vous que je vous aide à configurer Supabase maintenant ?** 🚀
