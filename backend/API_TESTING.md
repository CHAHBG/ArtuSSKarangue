# 🧪 API Testing Guide - ARTU SI SEN KARANGUE

Complete guide for testing all API endpoints with examples.

## 📋 Prerequisites

- Backend server running on `http://localhost:5000`
- Tool for making HTTP requests (curl, Postman, or Insomnia)
- PostgreSQL with PostGIS
- Redis running

## 🔧 Setup

### Get Base URL

```bash
# Local development
BASE_URL=http://localhost:5000/api/v1

# Production (example)
BASE_URL=https://your-app.railway.app/api/v1
```

---

## 1️⃣ Authentication Tests

### 1.1 Register New User

```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "ablaye",
    "email": "ablaye@example.com",
    "password": "SecurePass123!",
    "phone_number": "+221770000000",
    "role": "citizen"
  }'
```

**Expected Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "ablaye",
      "email": "ablaye@example.com",
      "phone_number": "+221770000000",
      "role": "citizen",
      "created_at": "2025-10-03T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

💾 **Save the `accessToken` for subsequent requests!**

### 1.2 Login User

```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "ablaye@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "ablaye",
      "email": "ablaye@example.com",
      "role": "citizen",
      "is_verified": false,
      "is_active": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Get Current User Profile

```powershell
curl http://localhost:5000/api/v1/auth/me `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "ablaye",
      "email": "ablaye@example.com",
      "phone_number": "+221770000000",
      "role": "citizen",
      "profile_picture": null,
      "is_verified": false,
      "is_active": true,
      "latitude": null,
      "longitude": null,
      "created_at": "2025-10-03T10:00:00.000Z",
      "updated_at": "2025-10-03T10:00:00.000Z"
    }
  }
}
```

### 1.4 Update Profile

```powershell
curl -X PATCH http://localhost:5000/api/v1/auth/me `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "username": "ablaye_ndiaye",
    "phone_number": "+221775555555"
  }'
```

### 1.5 Update User Location

```powershell
curl -X PATCH http://localhost:5000/api/v1/auth/location `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "latitude": 14.6937,
    "longitude": -17.4441
  }'
```

### 1.6 Change Password

```powershell
curl -X PATCH http://localhost:5000/api/v1/auth/change-password `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

### 1.7 Refresh Token

```powershell
curl -X POST http://localhost:5000/api/v1/auth/refresh `
  -H "Content-Type: application/json" `
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 1.8 Logout

```powershell
curl -X POST http://localhost:5000/api/v1/auth/logout `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 2️⃣ Emergency Tests

### 2.1 Create Emergency (Fire)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "type": "fire",
    "title": "Large fire at commercial building",
    "description": "Multiple floors engulfed in flames. Fire department notified. Requesting backup and medical support.",
    "latitude": 14.6937,
    "longitude": -17.4441,
    "address": "Avenue Nelson Mandela, Dakar, Senegal",
    "severity": 5,
    "is_anonymous": false
  }'
```

**Expected Response (201):**
```json
{
  "status": "success",
  "message": "Emergency reported successfully",
  "data": {
    "emergency": {
      "id": 1,
      "type": "fire",
      "title": "Large fire at commercial building",
      "description": "Multiple floors engulfed...",
      "address": "Avenue Nelson Mandela, Dakar, Senegal",
      "severity": 5,
      "status": "active",
      "is_anonymous": false,
      "latitude": 14.6937,
      "longitude": -17.4441,
      "created_at": "2025-10-03T10:05:00.000Z"
    }
  }
}
```

### 2.2 Create Emergency (Medical)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "type": "medical",
    "title": "Person collapsed in street",
    "description": "Elderly person collapsed. Not breathing normally. Needs immediate medical attention.",
    "latitude": 14.6850,
    "longitude": -17.4500,
    "severity": 4
  }'
```

### 2.3 Create Emergency (Accident)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "type": "accident",
    "title": "Multi-vehicle collision on highway",
    "description": "3 cars involved. Multiple injuries. Traffic blocked. Police and ambulance needed.",
    "latitude": 14.7000,
    "longitude": -17.4600,
    "address": "Highway A1, near exit 12",
    "severity": 4
  }'
```

### 2.4 Get Nearby Emergencies

```powershell
# Get all active emergencies within 5km radius
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=5000&status=active"
```

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `radius` (optional): Search radius in meters (default: 5000, max: 50000)
- `type` (optional): Filter by type (fire, medical, accident, etc.)
- `status` (optional): Filter by status (active, in_progress, resolved)
- `limit` (optional): Max results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Expected Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "emergencies": [
      {
        "id": 1,
        "type": "fire",
        "title": "Large fire at commercial building",
        "description": "Multiple floors...",
        "address": "Avenue Nelson Mandela, Dakar",
        "severity": 5,
        "status": "active",
        "is_anonymous": false,
        "upvotes": 12,
        "downvotes": 1,
        "view_count": 45,
        "latitude": 14.6937,
        "longitude": -17.4441,
        "distance": 0,
        "username": "ablaye",
        "profile_picture": null,
        "media_count": 3,
        "created_at": "2025-10-03T10:05:00.000Z"
      },
      {
        "id": 2,
        "type": "medical",
        "title": "Person collapsed in street",
        "distance": 850.5,
        ...
      },
      {
        "id": 3,
        "type": "accident",
        "title": "Multi-vehicle collision",
        "distance": 1250.3,
        ...
      }
    ]
  }
}
```

### 2.5 Get Emergencies by Type

```powershell
# Get only fire emergencies
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=10000&type=fire"

# Get only medical emergencies
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=10000&type=medical"
```

### 2.6 Get Emergency by ID

```powershell
curl http://localhost:5000/api/v1/emergencies/1
```

**Expected Response (200):**
```json
{
  "status": "success",
  "data": {
    "emergency": {
      "id": 1,
      "type": "fire",
      "title": "Large fire at commercial building",
      "description": "Multiple floors engulfed in flames...",
      "address": "Avenue Nelson Mandela, Dakar, Senegal",
      "severity": 5,
      "status": "active",
      "is_anonymous": false,
      "upvotes": 12,
      "downvotes": 1,
      "view_count": 46,
      "latitude": 14.6937,
      "longitude": -17.4441,
      "user_id": 1,
      "username": "ablaye",
      "profile_picture": null,
      "phone_number": "+221770000000",
      "responder_id": null,
      "responder_username": null,
      "created_at": "2025-10-03T10:05:00.000Z",
      "updated_at": "2025-10-03T10:05:00.000Z",
      "resolved_at": null,
      "media": [
        {
          "id": 1,
          "media_type": "photo",
          "url": "https://cloudinary.com/...",
          "thumbnail_url": "https://cloudinary.com/...",
          "duration": null
        }
      ]
    }
  }
}
```

### 2.7 Update Emergency Status (Responder/Admin only)

```powershell
curl -X PATCH http://localhost:5000/api/v1/emergencies/1 `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "status": "in_progress"
  }'
```

**Status Options:**
- `active` - Emergency just reported
- `in_progress` - Responders on scene
- `resolved` - Emergency resolved
- `false_alarm` - Not a real emergency

### 2.8 Vote on Emergency (Upvote)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies/1/vote `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "vote_type": "upvote"
  }'
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Vote recorded"
}
```

### 2.9 Vote on Emergency (Downvote)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies/1/vote `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "vote_type": "downvote"
  }'
```

### 2.10 Get My Emergency Reports

```powershell
curl "http://localhost:5000/api/v1/emergencies/my-reports?status=active&limit=20" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2.11 Get Emergency Statistics

```powershell
# Global statistics
curl http://localhost:5000/api/v1/emergencies/stats

# Statistics for specific area
curl "http://localhost:5000/api/v1/emergencies/stats?latitude=14.6937&longitude=-17.4441&radius=10000"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "data": {
    "by_type": [
      {
        "type": "fire",
        "count": "5",
        "avg_severity": "4.2"
      },
      {
        "type": "medical",
        "count": "8",
        "avg_severity": "3.8"
      },
      {
        "type": "accident",
        "count": "12",
        "avg_severity": "3.5"
      }
    ],
    "by_status": [
      {
        "status": "active",
        "count": "15"
      },
      {
        "status": "in_progress",
        "count": "6"
      },
      {
        "status": "resolved",
        "count": "4"
      }
    ]
  }
}
```

### 2.12 Delete Emergency

```powershell
curl -X DELETE http://localhost:5000/api/v1/emergencies/1 `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 3️⃣ Health & Info Tests

### 3.1 Health Check

```powershell
curl http://localhost:5000/health
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-03T10:00:00.000Z",
  "uptime": 1234.56,
  "environment": "development"
}
```

### 3.2 API Info

```powershell
curl http://localhost:5000/api
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "ARTU SI SEN KARANGUE Emergency Response API",
  "version": "v1",
  "documentation": "/api/v1/docs"
}
```

---

## 4️⃣ Error Handling Tests

### 4.1 Test Invalid Login

```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401):**
```json
{
  "status": "fail",
  "message": "Invalid email or password"
}
```

### 4.2 Test Unauthorized Access

```powershell
curl http://localhost:5000/api/v1/auth/me
```

**Expected Response (401):**
```json
{
  "status": "fail",
  "message": "You are not logged in. Please log in to access this resource."
}
```

### 4.3 Test Invalid Emergency Data

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "type": "invalid_type",
    "title": "No",
    "latitude": 200,
    "longitude": -200
  }'
```

**Expected Response (400):**
```json
{
  "status": "fail",
  "message": "\"type\" must be one of [accident, fire, medical, flood, security, earthquake, other], \"title\" length must be at least 5 characters long, \"latitude\" must be less than or equal to 90"
}
```

### 4.4 Test Rate Limiting

```powershell
# Make 6+ requests in 15 minutes to auth endpoint
for ($i=1; $i -le 10; $i++) {
  curl -X POST http://localhost:5000/api/v1/auth/login `
    -H "Content-Type: application/json" `
    -d '{"email":"test@test.com","password":"wrong"}'
}
```

**Expected Response (429) after 5 attempts:**
```json
{
  "status": "error",
  "message": "Too many login attempts from this IP, please try again after 15 minutes."
}
```

---

## 5️⃣ Geospatial Query Tests

### 5.1 Test Different Radius Values

```powershell
# 1km radius
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=1000"

# 10km radius
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=10000"

# 50km radius (maximum)
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=50000"
```

### 5.2 Test Pagination

```powershell
# First page (0-20)
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=10000&limit=20&offset=0"

# Second page (20-40)
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=10000&limit=20&offset=20"
```

---

## 📊 Test Scenarios

### Scenario 1: Complete User Journey

```powershell
# 1. Register
curl -X POST http://localhost:5000/api/v1/auth/register ...

# 2. Login
curl -X POST http://localhost:5000/api/v1/auth/login ...

# 3. Update location
curl -X PATCH http://localhost:5000/api/v1/auth/location ...

# 4. Create emergency
curl -X POST http://localhost:5000/api/v1/emergencies ...

# 5. Get nearby emergencies
curl "http://localhost:5000/api/v1/emergencies/nearby?..."

# 6. Vote on emergency
curl -X POST http://localhost:5000/api/v1/emergencies/1/vote ...

# 7. Check my reports
curl http://localhost:5000/api/v1/emergencies/my-reports ...

# 8. Logout
curl -X POST http://localhost:5000/api/v1/auth/logout ...
```

### Scenario 2: Emergency Responder Workflow

```powershell
# 1. Login as responder
curl -X POST http://localhost:5000/api/v1/auth/login ...

# 2. Get active emergencies
curl "http://localhost:5000/api/v1/emergencies/nearby?status=active&..."

# 3. Accept emergency (update to in_progress)
curl -X PATCH http://localhost:5000/api/v1/emergencies/1 `
  -d '{"status": "in_progress"}'

# 4. Resolve emergency
curl -X PATCH http://localhost:5000/api/v1/emergencies/1 `
  -d '{"status": "resolved"}'
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** Ensure backend server is running on port 5000

### Issue: "Database connection error"
**Solution:** Check PostgreSQL is running and credentials in `.env`

### Issue: "PostGIS not found"
**Solution:** Enable PostGIS: `CREATE EXTENSION postgis;`

### Issue: "Redis connection failed"
**Solution:** Start Redis server

### Issue: "Invalid token"
**Solution:** Use a fresh token from login/register response

---

## ✅ Test Checklist

- [ ] Register new user
- [ ] Login user
- [ ] Get user profile
- [ ] Update profile
- [ ] Update location
- [ ] Create fire emergency
- [ ] Create medical emergency
- [ ] Create accident emergency
- [ ] Get nearby emergencies (5km)
- [ ] Get nearby emergencies (10km)
- [ ] Filter by type (fire)
- [ ] Filter by status (active)
- [ ] Get emergency by ID
- [ ] Upvote emergency
- [ ] Downvote emergency
- [ ] Get my reports
- [ ] Get statistics
- [ ] Update emergency status
- [ ] Delete emergency
- [ ] Test rate limiting
- [ ] Test invalid credentials
- [ ] Test unauthorized access
- [ ] Health check
- [ ] Logout

---

**All tests passing? You're ready for production! 🚀**
