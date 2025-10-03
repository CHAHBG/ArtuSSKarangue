# ARTU SI SEN KARANGUE - Mobile App

## 🚀 Emergency Response Mobile Application

A React Native mobile application built with Expo for reporting and managing emergencies in real-time.

## 📱 Features

- **Authentication**: Register, login, and profile management
- **Emergency Reporting**: Report emergencies with GPS location and photos
- **Real-time Map**: View nearby emergencies on an interactive map
- **SOS Button**: Quick emergency alert with automatic location sharing
- **Push Notifications**: Get notified about nearby emergencies
- **Community Voting**: Vote on emergencies to prioritize response
- **Facility Finder**: Locate nearby hospitals, police, fire stations

## 🛠️ Tech Stack

- **React Native** + **Expo** - Cross-platform mobile framework
- **React Navigation** - Navigation library
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Formik + Yup** - Form handling and validation
- **AsyncStorage** - Local storage
- **Expo Location** - GPS/Geolocation
- **Expo Camera** - Camera access
- **React Native Maps** - Map visualization

## 📦 Installation

```bash
# Install dependencies
cd mobile
npm install

# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on Web
npm run web
```

## 🔧 Configuration

### API Endpoint

Edit `src/config/api.js` to set your backend URL:

```javascript
const API_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:5000/api/v1'  // Use your computer's local IP, not localhost
  : 'https://your-production-url.com/api/v1';
```

**Important for Android/iOS**: Replace `localhost` with your computer's actual IP address (e.g., `192.168.1.100`) so the mobile device can reach your backend.

### Socket.io Configuration

Edit `src/config/socket.js`:

```javascript
const SOCKET_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:5000'
  : 'https://your-production-url.com';
```

## 📁 Project Structure

```
mobile/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json               # Dependencies
├── src/
│   ├── config/
│   │   ├── api.js            # Axios instance & API config
│   │   └── socket.js         # Socket.io client
│   ├── context/
│   │   ├── AuthContext.js    # Authentication state
│   │   └── LocationContext.js # Location tracking
│   ├── screens/
│   │   ├── LoginScreen.js    # Login screen
│   │   ├── RegisterScreen.js # Registration screen
│   │   ├── HomeScreen.js     # Home/feed screen
│   │   ├── MapScreen.js      # Map view
│   │   ├── ReportScreen.js   # Emergency reporting
│   │   └── ProfileScreen.js  # User profile
│   ├── components/
│   │   ├── Button.js         # Custom button component
│   │   └── Input.js          # Custom input component
│   └── theme/
│       └── index.js          # Colors, typography, spacing
```

## 🎨 Screens

### Authentication
- **Login**: Email/password authentication
- **Register**: Create new account with validation

### Main App
- **Home**: Emergency feed with real-time updates
- **Map**: Interactive map showing emergencies
- **Report**: Report new emergencies with photos & location
- **Profile**: View and edit user profile

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT tokens stored in AsyncStorage
3. Automatic token refresh on expiry
4. Socket.io connection established with auth token
5. Location tracking starts

## 📍 Location Services

- **Foreground**: Track location when app is active
- **Background**: Continue tracking for SOS alerts
- **Geofencing**: Join location-based Socket.io rooms
- **Real-time Updates**: Share location with nearby users

## 🔔 Notifications

- Emergency alerts within 5km radius
- Emergency status updates
- Response team assignments
- Community votes and comments

## 🧪 Testing

### On Physical Device (Recommended)

1. Install Expo Go app from App Store/Play Store
2. Run `npm start` in mobile directory
3. Scan QR code with Expo Go
4. Make sure phone and computer are on same WiFi
5. Update API_URL with your computer's local IP

### On Emulator

**Android (Windows/Mac/Linux):**
```bash
npm run android
```

**iOS (macOS only):**
```bash
npm run ios
```

## 🚀 Building for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

## 📝 Environment Setup

Make sure your backend is running:

```bash
# In backend directory
npm run dev
```

Backend should be accessible at `http://localhost:5000`

## 🐛 Troubleshooting

### Cannot connect to backend
- Use your computer's IP address, not `localhost`
- Check firewall settings
- Ensure backend is running
- Verify API_URL in `src/config/api.js`

### Location not working
- Grant location permissions in device settings
- Check GPS is enabled
- For iOS simulator, simulate location in Debug menu

### Socket.io not connecting
- Verify SOCKET_URL is correct
- Check network connectivity
- Ensure backend Socket.io server is running

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

## 🤝 Contributing

See main project README for contribution guidelines.

## 📄 License

See main project LICENSE file.

---

**ARTU SI SEN KARANGUE** - *L'aide est en route, urgence!* 🚨
