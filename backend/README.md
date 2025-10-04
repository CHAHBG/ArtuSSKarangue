# ARTU SI SEN KARANGUE - Backend API

Community-driven emergency response system backend built with Node.js, Express, PostgreSQL with PostGIS, and Redis.

## 🚀 Features

- ✅ **Authentication System** - JWT-based authentication with refresh tokens
- ✅ **Emergency Reporting** - Create, update, and manage emergency reports with geolocation
- ✅ **Real-time Updates** - Socket.io for live emergency broadcasts
- ✅ **Geospatial Queries** - Find nearby emergencies using PostGIS
- ✅ **Voting System** - Community validation through upvotes/downvotes
- ✅ **Role-based Access Control** - Citizen, Responder, and Admin roles
- ✅ **Rate Limiting** - Protection against API abuse
- ✅ **Caching** - Redis caching for improved performance
- ✅ **Security** - Bcrypt password hashing, JWT tokens, Helmet.js, input validation
- ✅ **Logging** - Winston logger with file and console transports
- ✅ **Audit Trail** - Track all important actions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v20.0.0 or higher
- **PostgreSQL** 16 with **PostGIS** extension
- **Redis** (for caching and sessions)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the repository

```powershell
git clone https://github.com/CHAHBG/ArtuSSKarangue.git
cd ArtuSSKarangue/backend
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Set up PostgreSQL with PostGIS

#### Option A: Using PostgreSQL locally (Windows)

1. Download and install PostgreSQL 16: https://www.postgresql.org/download/windows/
2. During installation, make sure to install **Stack Builder** and select **PostGIS**
3. Open pgAdmin or psql and create a database:

```sql
CREATE DATABASE artu_emergency_db;
```

4. Connect to the database and enable PostGIS:

```sql
\c artu_emergency_db
CREATE EXTENSION postgis;
```

#### Option B: Using Supabase (Free tier)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Settings > Database** and copy your connection details
4. PostGIS is already enabled in Supabase

### 4. Set up Redis

#### Option A: Redis locally (Windows)

1. Download Redis for Windows: https://github.com/tporadowski/redis/releases
2. Extract and run `redis-server.exe`
3. Redis will run on `localhost:6379`

#### Option B: Redis Cloud (Free tier)

1. Go to https://redis.com/try-free/
2. Create a free account and database
3. Copy your connection details

### 5. Configure environment variables

Copy the `.env.example` file to `.env`:

```powershell
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration (PostgreSQL with PostGIS)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artu_emergency_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (Optional - for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### 6. Run database migrations

This will create all necessary tables and seed initial data:

```powershell
npm run migrate
```

### 7. Start the development server

```powershell
npm run dev
```

The server will start on `http://localhost:5000`

## 🧪 Testing the API

### Health Check

```powershell
curl http://localhost:5000/health
```

### Register a User

```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "phone_number": "+221770000000"
  }'
```

### Login

```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Emergency (requires authentication)

```powershell
curl -X POST http://localhost:5000/api/v1/emergencies `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{
    "type": "fire",
    "title": "Fire at downtown building",
    "description": "Large fire reported at commercial building",
    "latitude": 14.6937,
    "longitude": -17.4441,
    "address": "Avenue Nelson Mandela, Dakar",
    "severity": 5
  }'
```

### Get Nearby Emergencies

```powershell
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=5000"
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # PostgreSQL connection
│   │   ├── redis.js      # Redis connection
│   │   └── migrate.js    # Database migrations
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   └── emergencyController.js
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── rateLimiter.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   └── emergencyRoutes.js
│   ├── utils/            # Utility functions
│   │   ├── logger.js
│   │   ├── password.js
│   │   ├── jwt.js
│   │   └── appError.js
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── logs/                 # Application logs
├── .env                  # Environment variables
├── .env.example          # Example environment file
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Public |
| POST | `/api/v1/auth/logout` | Logout user | Private |
| GET | `/api/v1/auth/me` | Get current user | Private |
| PATCH | `/api/v1/auth/me` | Update profile | Private |
| PATCH | `/api/v1/auth/change-password` | Change password | Private |
| DELETE | `/api/v1/auth/me` | Delete account | Private |
| PATCH | `/api/v1/auth/location` | Update location | Private |

### Emergencies

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/emergencies` | Create emergency | Private |
| GET | `/api/v1/emergencies/nearby` | Get nearby emergencies | Public |
| GET | `/api/v1/emergencies/my-reports` | Get user's reports | Private |
| GET | `/api/v1/emergencies/stats` | Get statistics | Public |
| GET | `/api/v1/emergencies/:id` | Get emergency by ID | Public |
| PATCH | `/api/v1/emergencies/:id` | Update emergency | Private |
| DELETE | `/api/v1/emergencies/:id` | Delete emergency | Private |
| POST | `/api/v1/emergencies/:id/vote` | Vote on emergency | Private |

## 🔒 Security Features

- **Bcrypt** password hashing with 12 rounds
- **JWT** tokens with refresh token mechanism
- **Rate limiting** on authentication and API endpoints
- **Helmet.js** for secure HTTP headers
- **Input validation** using Joi
- **SQL injection** prevention through parameterized queries
- **CORS** configuration
- **Request timeout** (30 seconds)
- **Audit logging** for sensitive operations

## 📊 Database Schema

Key tables:

- **users** - User accounts with geospatial location
- **emergencies** - Emergency reports with PostGIS POINT type
- **emergency_media** - Photos, videos, audio files
- **emergency_votes** - Upvotes/downvotes
- **facilities** - Hospitals, police stations, fire stations
- **notifications** - Push notifications
- **sos_alerts** - SOS button activations
- **refresh_tokens** - JWT refresh tokens
- **audit_logs** - Action tracking

## 🚀 Deployment

### Deploy to Railway.app (Recommended)

1. Create account at https://railway.app
2. Create new project
3. Add PostgreSQL and Redis plugins
4. Connect your GitHub repository
5. Set environment variables
6. Deploy!

### Deploy to Render.com

1. Create account at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Add PostgreSQL and Redis instances
5. Configure environment variables
6. Deploy!

## 📝 Scripts

```powershell
# Development
npm run dev          # Start with nodemon

# Production
npm start            # Start server

# Database
npm run migrate      # Run migrations

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier

# Testing
npm test             # Run tests
```

## 🐛 Troubleshooting

### PostgreSQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running and connection details in `.env` are correct.

### PostGIS Extension Error

```
ERROR: type "geography" does not exist
```

**Solution:** Enable PostGIS extension:

```sql
CREATE EXTENSION postgis;
```

### Redis Connection Error

```
Error: Redis connection to localhost:6379 failed
```

**Solution:** Ensure Redis is running. On Windows, run `redis-server.exe`.

### JWT Secret Error

```
Error: secretOrPrivateKey must have a value
```

**Solution:** Set `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` file.

## 📖 Documentation

For detailed API documentation, visit:
- Postman Collection: [Coming Soon]
- Swagger UI: `http://localhost:5000/api/v1/docs` [Coming Soon]

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

ARTU SI SEN KARANGUE Development Team

## 🙏 Acknowledgments

- PostGIS for geospatial capabilities
- Express.js community
- All contributors and testers

---

**Need Help?** Open an issue on GitHub or contact the development team.
