# 🚀 Quick Start Guide - ARTU SI SEN KARANGUE

## ⚡ 5-Minute Setup

### 1. Start Backend (Terminal 1)
```powershell
cd backend
npm run dev
```

Wait for: **🚀 Server running on port 5000**

### 2. Get Your IP Address (Terminal 2)
```powershell
ipconfig
```

Copy your **IPv4 Address** (e.g., `192.168.1.100`)

### 3. Update Mobile Config
Edit these files and replace `localhost` with your IP:

**File:** `mobile/src/config/api.js`
```javascript
const API_URL = __DEV__ 
  ? 'http://192.168.1.100:5000/api/v1'  // ← Your IP here
  : 'https://your-production-url.com/api/v1';
```

**File:** `mobile/src/config/socket.js`
```javascript
const SOCKET_URL = __DEV__ 
  ? 'http://192.168.1.100:5000'  // ← Your IP here
  : 'https://your-production-url.com';
```

### 4. Start Mobile App (Terminal 3)
```powershell
cd mobile
npm start
```

### 5. Open on Phone
1. Install **Expo Go** app
2. Scan QR code from terminal
3. Grant permissions when prompted
4. Start using the app!

---

## 📱 Test Flow

1. **Register** → Create account
2. **Login** → Enter credentials
3. **Grant Permissions** → Location, Camera, Photos
4. **Report Emergency** → Tap "Signaler" tab
5. **View on Map** → See marker on map
6. **Vote** → Upvote emergency from home
7. **SOS** → Tap red SOS button for quick alert

---

## 🔥 Quick Commands

### Backend
```powershell
cd backend
npm run migrate    # Setup database
npm run dev        # Start server
npm test          # Run tests
```

### Mobile
```powershell
cd mobile
npm start         # Start Expo
npm run android   # Android emulator
npm run ios       # iOS simulator
```

---

## 📞 Need Help?

### Backend not starting?
- Check PostgreSQL is running
- Verify `.env` file exists
- Run `npm run migrate` first

### Mobile can't connect?
- Use your IP, not localhost
- Same WiFi for phone and computer
- Backend must be running

### Location not working?
- Grant permissions in device settings
- Enable GPS
- Restart the app

---

## ✅ You're Ready!

Backend: **http://localhost:5000**
Mobile: **On your phone via Expo Go**

🎉 Start saving lives with ARTU SI SEN KARANGUE!
