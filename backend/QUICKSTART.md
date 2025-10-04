# 🚀 Quick Start Guide - ARTU SI SEN KARANGUE Backend

Get the emergency response API running in **under 10 minutes**!

## ⚡ Prerequisites Checklist

Before starting, install these tools:

- [ ] Node.js v20+ ([Download](https://nodejs.org/))
- [ ] PostgreSQL 16 with PostGIS ([Download](https://www.postgresql.org/download/))
- [ ] Redis ([Download for Windows](https://github.com/tporadowski/redis/releases))
- [ ] Git ([Download](https://git-scm.com/downloads))

## 📦 Step 1: Install & Setup (5 minutes)

### 1.1 Clone and Install

```powershell
# Clone repository
git clone https://github.com/CHAHBG/ArtuSSKarangue.git
cd ArtuSSKarangue/backend

# Install dependencies
npm install
```

### 1.2 Start PostgreSQL & Redis

**PostgreSQL:**
- Open pgAdmin or SQL Shell (psql)
- Create database:
```sql
CREATE DATABASE artu_emergency_db;
\c artu_emergency_db
CREATE EXTENSION postgis;
```

**Redis:**
- Run `redis-server.exe` (Windows)
- Should start on `localhost:6379`

### 1.3 Configure Environment

```powershell
# Copy example environment file
cp .env.example .env
```

**Edit `.env` file** - Change these minimum values:

```env
DB_PASSWORD=your_actual_postgres_password
JWT_SECRET=at_least_32_random_characters_here_change_me
JWT_REFRESH_SECRET=another_32_random_characters_here_change_me
```

**Generate secure secrets** (PowerShell):
```powershell
# Generate JWT secrets
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## 🏗️ Step 2: Initialize Database (2 minutes)

```powershell
# Run migrations (creates tables and seeds data)
npm run migrate
```

✅ You should see:
```
✅ Database tables created successfully
✅ Initial data seeded successfully
```

## 🎯 Step 3: Start Development Server (1 minute)

```powershell
# Start server with auto-reload
npm run dev
```

✅ You should see:
```
✅ Redis connected
🚀 Server running on port 5000 in development mode
📍 Health check: http://localhost:5000/health
📡 API: http://localhost:5000/api/v1
```

## 🧪 Step 4: Test API (2 minutes)

### Test 1: Health Check

```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-03T...",
  "uptime": 12.34
}
```

### Test 2: Register User

```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234!",
    "phone_number": "+221770000000"
  }'
```

Expected: User created with access token

### Test 3: Login

```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

**Save the `accessToken` from response!**

### Test 4: Create Emergency (replace YOUR_TOKEN)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -d '{
    "type": "fire",
    "title": "Test Emergency",
    "description": "This is a test emergency report",
    "latitude": 14.6937,
    "longitude": -17.4441,
    "severity": 3
  }'
```

### Test 5: Get Nearby Emergencies

```powershell
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=10000"
```

## ✅ Success! What's Next?

Your backend is now running! Here's what you can do:

### Option A: Build the Mobile App
- Navigate to `/mobile` folder
- Follow the mobile app setup guide

### Option B: Test with Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Import API collection (coming soon)
3. Start testing all endpoints

### Option C: Build Admin Dashboard
- Navigate to `/dashboard` folder
- Follow the dashboard setup guide

## 🐛 Common Issues

### Issue: "Cannot connect to database"

**Check:**
```powershell
# Test PostgreSQL connection
psql -U postgres -d artu_emergency_db -c "SELECT version();"
```

**Fix:** Ensure PostgreSQL is running and password in `.env` is correct

### Issue: "Redis connection failed"

**Check:**
```powershell
# Test Redis
redis-cli ping
```

**Expected:** `PONG`

**Fix:** Start Redis server

### Issue: "PostGIS not found"

**Fix:**
```sql
-- Connect to database
\c artu_emergency_db
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
-- Verify
SELECT PostGIS_version();
```

### Issue: "Port 5000 already in use"

**Fix:** Change port in `.env`:
```env
PORT=5001
```

## 📚 Next Steps

1. **Read the full README** - `README.md`
2. **Explore API endpoints** - See API documentation
3. **Set up mobile app** - Connect to this backend
4. **Configure deployment** - See `DEPLOYMENT.md`

## 🆘 Need Help?

- **GitHub Issues**: https://github.com/CHAHBG/ArtuSSKarangue/issues
- **Documentation**: See `README.md`
- **Check logs**: `logs/combined.log`

---

**Ready to save lives!** 🚑🔥👨‍⚕️
