# Configuration des Ports - ARTU SI SEN KARANGUE

## Services en cours d'exécution

### 🔙 Backend API
- **Port** : `5000`
- **URL** : `http://localhost:5000`
- **Health Check** : `http://localhost:5000/health`
- **API Base** : `http://localhost:5000/api/v1`
- **Commande** : `node src/server.js` (depuis le dossier backend)

### 📱 Frontend Mobile (Expo)
- **Port principal** : `8081` (ou `8082` si 8081 est occupé)
- **URL Web** : `http://localhost:8081`
- **URL Mobile** : `exp://192.168.1.9:8081`
- **Commande** : `npm start` (depuis le dossier mobile)

## Configuration CORS

Le backend accepte les requêtes depuis :
- ✅ `http://localhost:3000`
- ✅ `http://localhost:8081` (Expo web)
- ✅ `http://localhost:8082` (Expo web alternatif)
- ✅ `http://localhost:19006` (Expo DevTools)
- ✅ `http://localhost:19000` (Expo Metro Bundler)

## Variables d'environnement

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8081,http://localhost:8082,http://localhost:19006,http://localhost:19000
```

### Mobile (app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:5000/api/v1"
    }
  }
}
```

## Démarrage rapide

### 1. Backend
```powershell
cd backend
node src/server.js
```

### 2. Frontend
```powershell
cd mobile
npm start
# Puis presser 'w' pour ouvrir dans le navigateur
# Ou scanner le QR code avec Expo Go
```

## Résolution des problèmes

### Port déjà utilisé (EADDRINUSE)
```powershell
# Trouver le processus
netstat -ano | findstr :5000

# Tuer le processus (remplacer PID)
taskkill /F /PID <PID>
```

### Erreur CORS
- Vérifier que le backend est démarré
- Vérifier que les ports correspondent dans la configuration CORS
- Redémarrer le backend après modification de `app.js`

### Erreur de connexion (ERR_CONNECTION_REFUSED)
- Vérifier que le backend est démarré sur le port 5000
- Tester l'API : `http://localhost:5000/health`
- Vérifier les logs du backend

## Logs

### Backend
- `backend/logs/combined.log` : Tous les logs
- `backend/logs/error.log` : Erreurs uniquement
- `backend/logs/exceptions.log` : Exceptions non gérées
- `backend/logs/rejections.log` : Promesses rejetées

### Frontend
- Logs dans la console du navigateur
- Logs dans le terminal Expo

## Endpoints API principaux

### Authentification
- `POST /api/v1/auth/register` : Inscription
- `POST /api/v1/auth/login` : Connexion
- `GET /api/v1/auth/me` : Profil utilisateur
- `POST /api/v1/auth/logout` : Déconnexion

### Urgences
- `POST /api/v1/emergencies` : Créer une urgence
- `GET /api/v1/emergencies/nearby` : Urgences à proximité
- `GET /api/v1/emergencies/:id` : Détails d'une urgence
- `PUT /api/v1/emergencies/:id/status` : Mettre à jour le statut

## Notes

- Le backend utilise Redis (optionnel, désactivé par défaut)
- L'authentification utilise JWT avec cookies HttpOnly
- Les fichiers uploadés sont limités à 10MB
- Rate limiting : 100 requêtes par 15 minutes par IP
