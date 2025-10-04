# 🌍 Deployment Guide - ARTU SI SEN KARANGUE Backend

Production deployment guide for Railway, Render, Fly.io, and other platforms.

## 🎯 Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL/HTTPS configured
- [ ] CORS origins set correctly
- [ ] Rate limits configured
- [ ] Logging configured
- [ ] Error monitoring set up
- [ ] Backup strategy in place

## 🚂 Option 1: Deploy to Railway.app (Recommended)

Railway offers PostgreSQL with PostGIS and Redis plugins with free tier.

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Verify your account

### Step 2: Create New Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### Step 3: Add Database Services

1. **Add PostgreSQL with PostGIS:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically provides PostGIS
   - Copy connection string

2. **Add Redis:**
   - Click "New" → "Database" → "Redis"
   - Copy connection string

### Step 4: Configure Environment Variables

In Railway dashboard, add these variables:

```env
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Railway provides these automatically
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Or set individual DB variables
DB_HOST=<from Railway>
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<from Railway>

# Redis
REDIS_HOST=<from Railway>
REDIS_PORT=6379
REDIS_PASSWORD=<from Railway>

# JWT Secrets (Generate new secure ones!)
JWT_SECRET=<generate_secure_secret_min_32_chars>
JWT_REFRESH_SECRET=<generate_another_secure_secret>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Add your frontend URLs)
CORS_ORIGIN=https://your-frontend.com,https://your-mobile-app.com
ALLOWED_ORIGINS=https://your-frontend.com

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Security
BCRYPT_ROUNDS=12
REQUEST_TIMEOUT=30000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=info
```

### Step 5: Deploy

```bash
# Deploy from local
railway up

# Or connect GitHub repository
# Railway will auto-deploy on git push
```

### Step 6: Run Migrations

```bash
# Connect to Railway shell
railway run npm run migrate
```

### Step 7: Access Your API

Railway provides a URL like: `https://your-app.railway.app`

Test:
```bash
curl https://your-app.railway.app/health
```

---

## 🎨 Option 2: Deploy to Render.com

Render offers free tier with PostgreSQL and Redis.

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database

1. Dashboard → "New" → "PostgreSQL"
2. Name: `artu-emergency-db`
3. Database: `artu_emergency_db`
4. User: `artu_user`
5. Region: Choose closest to your users
6. Plan: Free tier
7. Click "Create Database"
8. **Enable PostGIS:**
   - Connect to database shell
   - Run: `CREATE EXTENSION postgis;`

### Step 3: Create Redis Instance

1. Dashboard → "New" → "Redis"
2. Name: `artu-redis`
3. Plan: Free tier
4. Click "Create Redis"

### Step 4: Create Web Service

1. Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `artu-emergency-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free tier

### Step 5: Add Environment Variables

In Render dashboard, add all variables from Railway example above.

Connection strings format:
```env
# PostgreSQL (from Render dashboard)
DATABASE_URL=postgres://user:pass@host/db

# Redis (from Render dashboard)
REDIS_URL=redis://host:port
```

### Step 6: Deploy

- Render auto-deploys on git push
- Or click "Manual Deploy"

### Step 7: Run Migrations

```bash
# In Render shell
npm run migrate
```

---

## ✈️ Option 3: Deploy to Fly.io

Fly.io offers edge deployment with good free tier.

### Step 1: Install Fly CLI

```powershell
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Login and Initialize

```bash
# Login
fly auth login

# Launch app
fly launch
```

### Step 3: Create PostgreSQL

```bash
# Create Postgres with PostGIS
fly postgres create --name artu-postgres

# Attach to app
fly postgres attach artu-postgres
```

### Step 4: Create Redis

```bash
# Create Redis
fly redis create --name artu-redis

# Get connection string
fly redis status artu-redis
```

### Step 5: Set Environment Variables

```bash
fly secrets set JWT_SECRET=your_secret_here
fly secrets set JWT_REFRESH_SECRET=your_refresh_secret_here
fly secrets set NODE_ENV=production
# ... add all other secrets
```

### Step 6: Deploy

```bash
fly deploy
```

### Step 7: Run Migrations

```bash
fly ssh console
npm run migrate
exit
```

---

## 🗄️ Database Setup

### For All Platforms: Enable PostGIS

Connect to your database and run:

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify installation
SELECT PostGIS_version();

-- Should return version like: 3.3.3
```

### Run Migrations

```bash
# Local
npm run migrate

# Railway
railway run npm run migrate

# Render (in shell)
npm run migrate

# Fly.io
fly ssh console -C "npm run migrate"
```

---

## 📊 Environment Variables Reference

### Required Variables

```env
NODE_ENV=production
PORT=5000
DB_HOST=<database_host>
DB_PORT=5432
DB_NAME=<database_name>
DB_USER=<database_user>
DB_PASSWORD=<database_password>
REDIS_HOST=<redis_host>
REDIS_PORT=6379
JWT_SECRET=<min_32_chars>
JWT_REFRESH_SECRET=<min_32_chars>
CORS_ORIGIN=<your_frontend_urls>
```

### Optional Variables

```env
CLOUDINARY_CLOUD_NAME=<for_media_uploads>
CLOUDINARY_API_KEY=<cloudinary_key>
CLOUDINARY_API_SECRET=<cloudinary_secret>
MAPBOX_ACCESS_TOKEN=<for_maps>
SMTP_HOST=<for_emails>
SMTP_USER=<email_user>
SMTP_PASSWORD=<email_password>
```

---

## 🔐 Security Best Practices

### 1. Generate Secure Secrets

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 2. Set Strong CORS Policy

```env
CORS_ORIGIN=https://your-actual-domain.com
```

### 3. Use HTTPS Only

All platforms provide free SSL. Ensure:
```env
NODE_ENV=production
```

### 4. Rate Limiting

Keep production limits:
```env
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

### 5. Database Security

- Use strong passwords
- Enable SSL connections
- Restrict IP access
- Regular backups

---

## 📈 Monitoring & Logging

### Set Up Error Tracking

Integrate with services like:

**Option 1: Sentry**
```bash
npm install @sentry/node
```

Add to `server.js`:
```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

**Option 2: LogRocket**
```bash
npm install logrocket
```

### Health Monitoring

Set up uptime monitoring:
- https://uptimerobot.com (Free)
- https://pingdom.com
- https://statuscake.com

Monitor:
```
GET https://your-api.com/health
```

Expected status: 200 OK

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run tests
        run: cd backend && npm test
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 💾 Backup Strategy

### Database Backups

**Railway:** Automatic backups included

**Render:** 
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql
```

**Fly.io:**
```bash
# Create backup
fly postgres backup create -a artu-postgres
```

### Scheduled Backups

Set up cron job or use backup services:
- https://www.dbbackup.io
- https://simplebackups.com

---

## 🧪 Post-Deployment Testing

### Test Checklist

```bash
# 1. Health check
curl https://your-api.com/health

# 2. Register user
curl -X POST https://your-api.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test1234!"}'

# 3. Login
curl -X POST https://your-api.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'

# 4. Get nearby emergencies
curl "https://your-api.com/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=5000"
```

---

## 📱 Connect Mobile App

Update mobile app API URL:

```javascript
// mobile/src/constants/config.js
export const API_URL = 'https://your-api.railway.app/api/v1';
export const SOCKET_URL = 'https://your-api.railway.app';
```

---

## 🆘 Troubleshooting Production

### Issue: "Database connection timeout"

**Check:**
- Database is running
- Connection string is correct
- IP whitelist includes your server

### Issue: "Redis connection failed"

**Check:**
- Redis instance is running
- Connection credentials are correct
- Firewall allows connection

### Issue: "CORS error"

**Fix:**
```env
CORS_ORIGIN=https://your-actual-frontend-url.com
```

### View Logs

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Service → Logs tab

**Fly.io:**
```bash
fly logs
```

---

## ✅ Production Ready!

Your API is now deployed and ready for production use!

**Next Steps:**
1. Set up monitoring
2. Configure backups
3. Test all endpoints
4. Update mobile app
5. Launch! 🚀

---

**Need Help?** Check logs or open an issue on GitHub.
