# 🚑 ARTU SI SEN KARANGUE

**"Help is on the way, emergency"** - Community-Driven Emergency Response System

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-blue.svg)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A real-time, geolocation-based emergency alert system that enables citizens to report and respond to emergencies like accidents, fires, medical emergencies, floods, and security incidents.

---

## 🌟 Overview

ARTU SI SEN KARANGUE (meaning "Help is on the way, emergency" in Wolof) is a comprehensive emergency response platform designed to:

- 📍 **Report emergencies** with precise geolocation
- 🗺️ **Visualize incidents** on interactive maps
- 🔔 **Send real-time alerts** to nearby users
- 👥 **Enable community validation** through voting
- 🏥 **Find nearest facilities** (hospitals, police, fire stations)
- 🆘 **Trigger SOS alerts** with configurable radius
- 📱 **Connect communities** for emergency coordination

---

## 🎯 Features

### Core Features

✅ **Emergency Reporting**
- Report accidents, fires, medical emergencies, floods, security incidents
- Attach photos, videos, and audio recordings
- Anonymous reporting option
- Severity levels (1-5)
- Real-time geolocation

✅ **Real-time Map View**
- Interactive map with emergency markers
- Clustering for performance
- Filter by type and status
- Distance calculation
- Live updates via Socket.io

✅ **Community Validation**
- Upvote/downvote system
- Prevent false reports
- Community-driven verification
- Emergency status tracking

✅ **SOS Button**
- Quick emergency alert
- Configurable alert radius
- Emergency contact notification
- Location sharing

✅ **Facility Finder**
- Find nearest hospitals
- Locate police stations
- Find fire stations
- Turn-by-turn navigation
- Operating hours and contact info

✅ **Notifications**
- Location-based push notifications
- Emergency status updates
- Community post alerts
- Configurable notification preferences

✅ **User Roles**
- **Citizens:** Report and view emergencies
- **Responders:** Manage and respond to emergencies
- **Admins:** Full system control and analytics

---

## 📁 Project Structure

```
ArtuSSKarangue/
├── backend/              # Node.js + Express API ✅ COMPLETE
│   ├── src/
│   │   ├── config/       # Database, Redis, environment
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Helper functions
│   │   ├── app.js        # Express setup
│   │   └── server.js     # Server entry point
│   ├── logs/             # Application logs
│   ├── README.md         # Backend documentation
│   ├── QUICKSTART.md     # Quick start guide
│   ├── DEPLOYMENT.md     # Deployment guide
│   └── package.json
│
├── mobile/               # React Native + Expo (Coming Soon)
│   ├── src/
│   │   ├── navigation/   # React Navigation
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API integration
│   │   ├── context/      # State management
│   │   └── constants/    # Constants & config
│   ├── assets/           # Images, fonts
│   ├── App.js
│   └── package.json
│
├── dashboard/            # React.js Admin Dashboard (Coming Soon)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Dashboard pages
│   │   ├── services/     # API integration
│   │   └── App.jsx
│   └── package.json
│
└── README.md             # This file
```

---

## 🚀 Quick Start

### Backend (API) - ✅ Complete

The backend API is **production-ready** and fully functional!

```powershell
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Set up PostgreSQL with PostGIS
# Create database: artu_emergency_db
# Enable PostGIS extension

# 4. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 5. Run migrations
npm run migrate

# 6. Start server
npm run dev

# API runs at http://localhost:5000
```

📖 **See [backend/QUICKSTART.md](backend/QUICKSTART.md) for detailed setup**

### Mobile App - 🔜 Coming Soon

React Native mobile application for iOS and Android.

### Web Dashboard - 🔜 Coming Soon

React.js admin dashboard for emergency management.

---

## 🛠️ Tech Stack

### Backend ✅
- **Runtime:** Node.js 20+
- **Framework:** Express.js 4.18
- **Database:** PostgreSQL 16 + PostGIS
- **Caching:** Redis 4.6
- **Real-time:** Socket.io 4.7
- **Authentication:** JWT + Bcrypt
- **Validation:** Joi
- **Logging:** Winston

### Mobile (Planned)
- **Framework:** React Native + Expo
- **Maps:** Mapbox GL
- **Navigation:** React Navigation v6
- **UI:** React Native Paper
- **State:** React Context API
- **API Client:** Axios
- **Real-time:** Socket.io-client

### Dashboard (Planned)
- **Framework:** React.js
- **Maps:** Mapbox GL JS
- **UI:** Material-UI or Ant Design
- **Charts:** Recharts or Chart.js
- **State:** Redux or Zustand

---

## 📊 Database Schema

### Key Tables (PostgreSQL + PostGIS)

- **users** - User accounts with geospatial location
- **emergencies** - Emergency reports (PostGIS POINT type)
- **emergency_media** - Photos, videos, audio
- **emergency_votes** - Community validation
- **facilities** - Hospitals, police, fire stations
- **notifications** - Push notifications
- **sos_alerts** - SOS activations
- **community_posts** - Community coordination
- **refresh_tokens** - JWT tokens
- **audit_logs** - Action tracking

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get profile
- `PATCH /api/v1/auth/me` - Update profile

### Emergencies
- `POST /api/v1/emergencies` - Create emergency
- `GET /api/v1/emergencies/nearby` - Get nearby emergencies
- `GET /api/v1/emergencies/:id` - Get emergency details
- `PATCH /api/v1/emergencies/:id` - Update emergency
- `POST /api/v1/emergencies/:id/vote` - Vote on emergency

📖 **See [backend/README.md](backend/README.md) for complete API documentation**

---

## 🔐 Security

- ✅ Bcrypt password hashing (12 rounds)
- ✅ JWT authentication with refresh tokens
- ✅ Rate limiting (API abuse protection)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Request timeouts
- ✅ Audit logging

---

## 🌍 Deployment

The backend is ready to deploy to:

- **Railway.app** (Recommended) - PostgreSQL + Redis included
- **Render.com** - Free tier available
- **Fly.io** - Edge deployment

📖 **See [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) for deployment guides**

---

## 📱 Screenshots

### Backend API
✅ **Fully functional and tested**
- Health check endpoint
- User authentication
- Emergency CRUD operations
- Geospatial queries
- Real-time WebSocket connections

### Mobile App (Coming Soon)
- Emergency reporting screen
- Interactive map view
- SOS button
- Facility finder
- Notification center

### Dashboard (Coming Soon)
- Real-time emergency map
- Analytics dashboard
- User management
- Emergency management

---

## 🧪 Testing

### Test the API

```powershell
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{"username":"test","email":"test@example.com","password":"Test1234!"}'

# Get nearby emergencies
curl "http://localhost:5000/api/v1/emergencies/nearby?latitude=14.6937&longitude=-17.4441&radius=5000"
```

---

## 📈 Roadmap

### ✅ Phase 1: Backend API (COMPLETE)
- [x] User authentication system
- [x] Emergency CRUD operations
- [x] Geospatial queries with PostGIS
- [x] Real-time updates with Socket.io
- [x] Voting system
- [x] Rate limiting and security
- [x] Comprehensive documentation

### 🔜 Phase 2: Mobile App (Next)
- [ ] React Native + Expo setup
- [ ] Authentication screens
- [ ] Emergency reporting UI
- [ ] Mapbox integration
- [ ] Camera & media picker
- [ ] Push notifications
- [ ] SOS button
- [ ] Facility finder

### 🔜 Phase 3: Web Dashboard
- [ ] React.js dashboard
- [ ] Real-time emergency map
- [ ] Emergency management
- [ ] Analytics & reporting
- [ ] User management

### 🔜 Phase 4: Advanced Features
- [ ] Community posts
- [ ] In-app chat
- [ ] AI duplicate detection
- [ ] Predictive analytics
- [ ] Multi-language support
- [ ] External API integrations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**ARTU SI SEN KARANGUE Development Team**

---

## 🙏 Acknowledgments

- PostGIS for powerful geospatial capabilities
- Express.js and Node.js communities
- Mapbox for mapping services
- Expo for React Native development
- All contributors and testers

---

## 📞 Support

- **GitHub Issues:** https://github.com/CHAHBG/ArtuSSKarangue/issues
- **Documentation:** See README files in each folder
- **Backend Quick Start:** [backend/QUICKSTART.md](backend/QUICKSTART.md)
- **Deployment Guide:** [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md)

---

## 📊 Project Status

- **Backend:** ✅ **100% Complete** - Production Ready
- **Mobile App:** 🔜 **Coming Soon**
- **Dashboard:** 🔜 **Coming Soon**
- **Documentation:** ✅ **Complete**
- **Deployment:** ✅ **Ready**

---

## 🎯 Mission

**To create a community-driven emergency response system that saves lives by enabling real-time emergency reporting, location-based alerts, and coordinated community response.**

---

**🚑 ARTU SI SEN KARANGUE - Ready to Save Lives!**

*Built with ❤️ for communities worldwide*
