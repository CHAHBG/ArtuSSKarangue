# Configuration de la Base de Données - ARTU SI SEN KARANGUE

## Prérequis

### PostgreSQL avec PostGIS

L'application nécessite PostgreSQL avec l'extension PostGIS pour gérer les données géospatiales.

**Installation Windows :**
1. Télécharger PostgreSQL : https://www.postgresql.org/download/windows/
2. Pendant l'installation, inclure **Stack Builder** pour installer PostGIS
3. Ou télécharger PostGIS séparément : https://postgis.net/windows_downloads/

**Vérifier l'installation :**
```bash
psql --version
```

## Configuration de la base de données

### 1. Se connecter à PostgreSQL

```bash
# Windows (PowerShell)
psql -U postgres

# Ou utiliser pgAdmin (interface graphique)
```

### 2. Créer la base de données

```sql
-- Créer la base de données
CREATE DATABASE ArtuDB;

-- Se connecter à la base
\c ArtuDB

-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Vérifier PostGIS
SELECT PostGIS_version();
```

### 3. Exécuter le script de création des tables

```bash
# Depuis le répertoire backend
psql -U postgres -d ArtuDB -f database-setup.sql
```

Ou manuellement dans psql :
```sql
\c ArtuDB
\i database-setup.sql
```

## Configuration du fichier .env

Le fichier `backend/.env` contient les paramètres de connexion :

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ArtuDB
DB_USER=postgres
DB_PASSWORD=Sensei00  # ⚠️ Changez ce mot de passe !
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### ⚠️ Sécurité

**Pour le développement local :**
- Le mot de passe par défaut est `Sensei00`
- Assurez-vous que c'est le même que celui de votre installation PostgreSQL

**Pour la production :**
1. Changez TOUS les mots de passe
2. Utilisez des mots de passe forts et uniques
3. Ne commitez JAMAIS le fichier `.env` dans Git

## Structure de la base de données

### Tables principales

1. **users** : Utilisateurs (citoyens et secouristes)
2. **emergencies** : Signalements d'urgence
3. **emergency_updates** : Mises à jour de statut
4. **volunteers** : Volontaires répondant aux urgences
5. **audit_logs** : Journal d'audit
6. **refresh_tokens** : Tokens de rafraîchissement JWT

### Types de données géospatiales

- Les coordonnées sont stockées au format **PostGIS GEOGRAPHY**
- Système de référence : **WGS 84 (SRID 4326)**
- Format : `POINT(longitude latitude)`

## Commandes utiles

### Vérifier la connexion

```bash
# Tester la connexion depuis le terminal
psql -U postgres -d ArtuDB -c "SELECT version();"
```

### Lister les tables

```sql
\dt
```

### Voir la structure d'une table

```sql
\d users
\d emergencies
```

### Compter les utilisateurs

```sql
SELECT COUNT(*) FROM users;
```

### Voir les urgences actives

```sql
SELECT id, type, status, created_at 
FROM emergencies 
WHERE status = 'active' 
ORDER BY created_at DESC;
```

### Vérifier PostGIS

```sql
SELECT PostGIS_full_version();
```

## Résolution des problèmes

### Erreur : "SASL: client password must be a string"

**Cause :** Le mot de passe de la base de données n'est pas défini ou incorrect dans `.env`

**Solution :**
1. Vérifiez que `DB_PASSWORD` est défini dans `backend/.env`
2. Assurez-vous que le mot de passe correspond à celui de PostgreSQL
3. Redémarrez le backend après modification

```bash
# Changer le mot de passe PostgreSQL si nécessaire
psql -U postgres
\password postgres
```

### Erreur : "database does not exist"

**Solution :**
```sql
CREATE DATABASE ArtuDB;
```

### Erreur : "extension postgis does not exist"

**Solution :**
```sql
\c ArtuDB
CREATE EXTENSION postgis;
```

### Erreur : "relation users does not exist"

**Cause :** Les tables n'ont pas été créées

**Solution :**
```bash
psql -U postgres -d ArtuDB -f backend/database-setup.sql
```

### Port 5432 déjà utilisé

**Vérifier quel processus utilise le port :**
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
