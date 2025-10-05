import { io } from 'socket.io-client';

const SOCKET_URL = __DEV__ 
  ? 'http://localhost:5000'
  : 'https://artusskarangue-production.up.railway.app';

console.log('🔌 Socket URL:', SOCKET_URL);

let socket = null;

export const initializeSocket = (token) => {
  try {
    if (!socket) {
      console.log('🔌 Initializing socket with token:', token ? 'present' : 'missing');
      
      socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
  } catch (error) {
    console.error('❌ Error initializing socket:', error);
    // Don't throw - socket is optional
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinLocationRoom = (latitude, longitude) => {
  if (socket) {
    socket.emit('join_location', { latitude, longitude });
  }
};

export const leaveLocationRoom = (latitude, longitude) => {
  if (socket) {
    socket.emit('leave_location', { latitude, longitude });
  }
};

export const updateLocation = (latitude, longitude) => {
  if (socket) {
    socket.emit('update_location', { latitude, longitude });
  }
};

export const listenToEmergencies = (callback) => {
  if (socket) {
    socket.on('new_emergency', callback);
  }
};

export const listenToEmergencyUpdates = (callback) => {
  if (socket) {
    socket.on('emergency_update', callback);
  }
};

export const stopListeningToEmergencies = () => {
  if (socket) {
    socket.off('new_emergency');
    socket.off('emergency_update');
  }
};
