import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validate axios immediately
if (!axios) {
  console.error('❌ CRITICAL: axios module is undefined');
  throw new Error('axios module failed to load - check if axios is installed');
}

if (typeof axios.create !== 'function') {
  console.error('❌ CRITICAL: axios.create is not a function');
  throw new Error('axios module is invalid - reinstall axios');
}

// Log successful imports
console.log('✅ axios loaded, version:', axios.VERSION || 'unknown');
console.log('✅ AsyncStorage loaded');

// API Configuration
const API_URL = __DEV__ 
  ? 'http://localhost:5000/api/v1'  // Development
  : 'https://artusskarangue-production.up.railway.app/api/v1';  // Production - Railway

// Log API URL for debugging
console.log('🌐 API URL:', API_URL);
console.log('🔧 __DEV__:', __DEV__);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Reduced from 10s to 5s for faster failure
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't throw on network errors, let interceptors handle
  validateStatus: function (status) {
    return status < 500; // Accept all status codes < 500
  },
});

console.log('✅ API instance created successfully');
console.log('✅ API.post is', typeof api.post);

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log network errors but don't crash
    if (error.code === 'ECONNABORTED') {
      console.warn('⚠️ Request timeout - API may be slow or unreachable');
    } else if (error.message === 'Network Error') {
      console.warn('⚠️ Network error - Check internet connection');
    }
    
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          await AsyncStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // You can emit an event here to navigate to login screen
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
