# GUIDE FINAL : Configuration Supabase Complete# Configuration de la Base de Données - ARTU SI SEN KARANGUE



## Statut Actuel## Prérequis



✅ Fichier .env configure avec Supabase### PostgreSQL avec PostGIS

✅ Scripts corriges (sans emojis)

✅ DATABASE_URL correcteL'application nécessite PostgreSQL avec l'extension PostGIS pour gérer les données géospatiales.

✅ Test script mis a jour (role: citizen)

**Installation Windows :**

## Prochaines Etapes1. Télécharger PostgreSQL : https://www.postgresql.org/download/windows/

2. Pendant l'installation, inclure **Stack Builder** pour installer PostGIS

### IMPORTANT : Creer les Tables dans Supabase MAINTENANT3. Ou télécharger PostGIS séparément : https://postgis.net/windows_downloads/



**Avant de tester, vous DEVEZ creer les tables !****Vérifier l'installation :**

```bash

1. **Aller sur :** https://supabase.com/dashboardpsql --version

2. **Selectionner votre projet** (xsnrzyzgphmjivdqpgst)```

3. **SQL Editor** (menu gauche)

4. **New query**## Configuration de la base de données

5. **Copier-coller ce script SQL complet :**

### 1. Se connecter à PostgreSQL

```sql

-- Tables pour ARTU SI SEN KARANGUE```bash

# Windows (PowerShell)

CREATE TABLE utilisateurs (psql -U postgres

    id SERIAL PRIMARY KEY,

    username VARCHAR(50) UNIQUE,# Ou utiliser pgAdmin (interface graphique)

    full_name VARCHAR(100),```

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,### 2. Créer la base de données

    phone_number VARCHAR(20),

    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'responder', 'admin')),```sql

    profile_picture VARCHAR(500),-- Créer la base de données

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,CREATE DATABASE ArtuDB;

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    last_login TIMESTAMP,-- Se connecter à la base

    is_active BOOLEAN DEFAULT true\c ArtuDB

);

-- Activer PostGIS

CREATE TABLE emergencies (CREATE EXTENSION IF NOT EXISTS postgis;

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,-- Vérifier PostGIS

    type VARCHAR(50) NOT NULL,SELECT PostGIS_version();

    description TEXT,```

    status VARCHAR(20) DEFAULT 'pending',

    priority VARCHAR(20) DEFAULT 'medium',### 3. Exécuter le script de création des tables

    latitude DECIMAL(10, 8) NOT NULL,

    longitude DECIMAL(11, 8) NOT NULL,```bash

    address TEXT,# Depuis le répertoire backend

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,psql -U postgres -d ArtuDB -f database-setup.sql

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP```

);

Ou manuellement dans psql :

-- Index```sql

CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);\c ArtuDB

CREATE INDEX idx_utilisateurs_username ON utilisateurs(username);\i database-setup.sql

CREATE INDEX idx_emergencies_user_id ON emergencies(user_id);```

CREATE INDEX idx_emergencies_status ON emergencies(status);

```## Configuration du fichier .env



6. **Cliquer "Run"** (en bas a droite)Le fichier `backend/.env` contient les paramètres de connexion :

7. **Verifier** : Table Editor -> vous devez voir `utilisateurs` et `emergencies`

```env

---# Database Configuration

DB_HOST=localhost

## Test CompletDB_PORT=5432

DB_NAME=ArtuDB

### Terminal 1 : Demarrer le BackendDB_USER=postgres

DB_PASSWORD=Sensei00  # ⚠️ Changez ce mot de passe !

```powershellDB_POOL_MIN=2

cd backendDB_POOL_MAX=10

node src/server.js```

```

### ⚠️ Sécurité

**Attendez de voir :**

```**Pour le développement local :**

✅ Redis connected- Le mot de passe par défaut est `Sensei00`

🚀 Server running on port 5000- Assurez-vous que c'est le même que celui de votre installation PostgreSQL

```

**Pour la production :**

### Terminal 2 : Tester l'API1. Changez TOUS les mots de passe

2. Utilisez des mots de passe forts et uniques

**Dans un NOUVEAU terminal :**3. Ne commitez JAMAIS le fichier `.env` dans Git



```powershell## Structure de la base de données

cd backend

.\test-supabase.ps1### Tables principales

```

1. **users** : Utilisateurs (citoyens et secouristes)

**Vous devriez voir :**2. **emergencies** : Signalements d'urgence

```3. **emergency_updates** : Mises à jour de statut

[OK] Backend en ligne4. **volunteers** : Volontaires répondant aux urgences

[OK] Utilisateur cree avec succes !5. **audit_logs** : Journal d'audit

[OK] Connexion reussie !6. **refresh_tokens** : Tokens de rafraîchissement JWT

[OK] Profil recupere !

TOUS LES TESTS REUSSIS !### Types de données géospatiales

```

- Les coordonnées sont stockées au format **PostGIS GEOGRAPHY**

---- Système de référence : **WGS 84 (SRID 4326)**

- Format : `POINT(longitude latitude)`

## Verifier dans Supabase Dashboard

## Commandes utiles

1. https://supabase.com/dashboard

2. Votre projet### Vérifier la connexion

3. **Table Editor** -> Table `utilisateurs`

4. Vous devez voir : **test.supabase@artu.sn**```bash

# Tester la connexion depuis le terminal

---psql -U postgres -d ArtuDB -c "SELECT version();"

```

## Si Erreur "relation does not exist"

### Lister les tables

➡️ **Les tables ne sont pas creees !**

➡️ **Revenez a l'etape "Creer les Tables"**```sql

\dt

---```



## Si Erreur "already exists"### Voir la structure d'une table



➡️ **Normal** si vous avez deja teste```sql

➡️ **Les tables existent deja**\d users

\d emergencies

---```



## Configuration Complete### Compter les utilisateurs



Une fois les tests reussis :```sql

SELECT COUNT(*) FROM users;

### Votre app mobile peut maintenant :```

- ✅ S'inscrire

- ✅ Se connecter### Voir les urgences actives

- ✅ Creer des urgences

- ✅ Utiliser toutes les fonctionnalites```sql

SELECT id, type, status, created_at 

### Backend utilise maintenant :FROM emergencies 

- ✅ Supabase PostgreSQL (cloud)WHERE status = 'active' 

- ✅ Plus besoin de PostgreSQL localORDER BY created_at DESC;

- ✅ Accessible depuis n'importe ou```



---### Vérifier PostGIS



## Credentials de Test```sql

SELECT PostGIS_full_version();

**Email :** test.supabase@artu.sn```

**Password :** Test123!

## Résolution des problèmes

**Utilisateur existant (si tables creees avant) :**

**Email :** cheikhabgn@gmail.com### Erreur : "SASL: client password must be a string"

**Password :** Sensei00

**Cause :** Le mot de passe de la base de données n'est pas défini ou incorrect dans `.env`

---

**Solution :**

## Commandes Utiles1. Vérifiez que `DB_PASSWORD` est défini dans `backend/.env`

2. Assurez-vous que le mot de passe correspond à celui de PostgreSQL

### Redemarrer le backend3. Redémarrez le backend après modification

```powershell

# Arreter : Ctrl+C dans le terminal du backend```bash

cd backend# Changer le mot de passe PostgreSQL si nécessaire

node src/server.jspsql -U postgres

```\password postgres

```

### Relancer les tests

```powershell### Erreur : "database does not exist"

cd backend

.\test-supabase.ps1**Solution :**

``````sql

CREATE DATABASE ArtuDB;

### Reconfigurer le mot de passe```

```powershell

cd backend### Erreur : "extension postgis does not exist"

.\setup-supabase.ps1

```**Solution :**

```sql

---\c ArtuDB

CREATE EXTENSION postgis;

## Fichiers Configuration```



- `backend/.env` - Variables d'environnement### Erreur : "relation users does not exist"

- `backend/src/config/database.js` - Configuration DB

**Cause :** Les tables n'ont pas été créées

**DATABASE_URL actuelle :**

```**Solution :**

postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres```bash

```psql -U postgres -d ArtuDB -f backend/database-setup.sql

```

---

### Port 5432 déjà utilisé

**COMMENCEZ PAR CREER LES TABLES DANS SUPABASE !**

**Ensuite testez avec les commandes ci-dessus.****Vérifier quel processus utilise le port :**

```powershell
netstat -ano | findstr :5432
```

**Arrêter PostgreSQL :**
```powershell
# Windows Services
net stop postgresql-x64-15
```

## Migrations et mises à jour

### Sauvegarde de la base de données

```bash
# Sauvegarde complète
pg_dump -U postgres -d ArtuDB > backup_$(date +%Y%m%d).sql

# Sauvegarde du schéma uniquement
pg_dump -U postgres -d ArtuDB --schema-only > schema.sql
```

### Restauration

```bash
psql -U postgres -d ArtuDB < backup.sql
```

### Réinitialiser la base de données

⚠️ **Attention : Supprime toutes les données !**

```sql
DROP DATABASE ArtuDB;
CREATE DATABASE ArtuDB;
\c ArtuDB
CREATE EXTENSION postgis;
\i database-setup.sql
```

## Variables d'environnement complètes

```env
# Database
DB_HOST=localhost              # Hôte de la base de données
DB_PORT=5432                   # Port PostgreSQL
DB_NAME=ArtuDB                 # Nom de la base
DB_USER=postgres               # Utilisateur PostgreSQL
DB_PASSWORD=Sensei00           # Mot de passe (⚠️ À changer !)
DB_POOL_MIN=2                  # Connexions minimum dans le pool
DB_POOL_MAX=10                 # Connexions maximum dans le pool
```

## Test de connexion avec Node.js

Créez un fichier `test-db.js` :

```javascript
require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Exécuter :
```bash
node test-db.js
```

## Ressources

- **PostgreSQL** : https://www.postgresql.org/docs/
- **PostGIS** : https://postgis.net/documentation/
- **pg (Node.js)** : https://node-postgres.com/
- **pgAdmin** : https://www.pgadmin.org/ (Interface graphique)

## Support

En cas de problème, vérifiez dans l'ordre :
1. PostgreSQL est-il démarré ?
2. La base de données existe-t-elle ?
3. Les identifiants dans `.env` sont-ils corrects ?
4. Le fichier `.env` est-il au bon endroit ?
5. Les tables ont-elles été créées ?
6. PostGIS est-il installé et activé ?
