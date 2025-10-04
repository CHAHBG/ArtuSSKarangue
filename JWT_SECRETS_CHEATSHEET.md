# 🔑 Secrets JWT - Aide-mémoire Rapide

## Générer des secrets

```powershell
cd backend
.\generate-jwt-secrets.ps1
```

## Secrets déjà générés pour vous

```env
JWT_SECRET=JXUdhlHWoqTRbCF3ukDVeiIAyfYNS1LKajO2mn56s70v8trwpEMQz4GBPZgxc9
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=cBPkvG0wqbpsaxrD9h3YIRL54tUQOSNjgVF2TzC6Wo8uXAiHfE7ZneKlMdJm1y
JWT_REFRESH_EXPIRES_IN=7d
```

## Où les utiliser ?

### 1. Development local (.env)
Déjà configuré dans `backend/.env`

### 2. Production Railway
**Railway Dashboard** → **Variables** → Copier les 4 lignes ci-dessus

## Variables complètes pour Railway

```env
DATABASE_URL=postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres
SUPABASE_URL=https://xsnrzyzgphmjivdqpgst.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzbnp6eXpncGhtaml2ZHFwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNTU5OTksImV4cCI6MjA0MzYzMTk5OX0.f-8b7bWnDHxGxSYV6YBqf8UrJQRCdMxQ4h1pSGGRjRc
JWT_SECRET=JXUdhlHWoqTRbCF3ukDVeiIAyfYNS1LKajO2mn56s70v8trwpEMQz4GBPZgxc9
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=cBPkvG0wqbpsaxrD9h3YIRL54tUQOSNjgVF2TzC6Wo8uXAiHfE7ZneKlMdJm1y
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
REDIS_ENABLED=false
CORS_ORIGIN=*
```

## ⚠️ Sécurité

- ✅ Secrets longs et aléatoires
- ✅ Différents pour access et refresh
- ❌ Ne JAMAIS commiter sur GitHub
- ❌ Ne JAMAIS partager publiquement

## 📚 Plus d'infos

Guide complet : `backend/JWT_SECRETS_GUIDE.md`
