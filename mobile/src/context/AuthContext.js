import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { initializeSocket, disconnectSocket } from '../config/socket';
import Toast from 'react-native-toast-message';

// Validate API import
if (!api) {
  console.error('❌ CRITICAL: api is undefined in AuthContext');
  throw new Error('API module not loaded correctly');
}

console.log('✅ AuthContext: api imported', typeof api);
console.log('✅ AuthContext: api.post available', typeof api?.post);

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('📱 Loading user from storage...');
      const [storedUser, token] = await AsyncStorage.multiGet([
        'user',
        'accessToken',
      ]);

      if (storedUser[1] && token[1]) {
        console.log('✅ User found in storage');
        setUser(JSON.parse(storedUser[1]));
        setIsAuthenticated(true);
        
        // Initialize socket but don't block if fails
        try {
          initializeSocket(token[1]);
        } catch (socketError) {
          console.warn('⚠️ Socket initialization failed (non-critical):', socketError.message);
        }
      } else {
        console.log('ℹ️ No stored user found');
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
      // Don't crash, just log and continue
    } finally {
      console.log('✅ Auth loading complete');
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Registering user...');
      const response = await api.post('/auth/register', userData);
      const { user: newUser, accessToken, refreshToken } = response.data.data;

      await AsyncStorage.multiSet([
        ['user', JSON.stringify(newUser)],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      setUser(newUser);
      setIsAuthenticated(true);
      initializeSocket(accessToken);

      Toast.show({
        type: 'success',
        text1: 'Bienvenue!',
        text2: 'Compte créé avec succès',
      });

      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: message,
      });
      return { success: false, error: message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedUser, accessToken, refreshToken } = response.data.data;

      await AsyncStorage.multiSet([
        ['user', JSON.stringify(loggedUser)],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      setUser(loggedUser);
      setIsAuthenticated(true);
      initializeSocket(accessToken);

      Toast.show({
        type: 'success',
        text1: 'Bienvenue!',
        text2: `Content de vous revoir ${loggedUser.full_name}`,
      });

      return { success: true, user: loggedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Email ou mot de passe incorrect';
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: message,
      });
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
      setUser(null);
      setIsAuthenticated(false);
      disconnectSocket();

      Toast.show({
        type: 'success',
        text1: 'Déconnecté',
        text2: 'À bientôt!',
      });
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.patch('/auth/update-profile', updates);
      const updatedUser = response.data.data.user;

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      Toast.show({
        type: 'success',
        text1: 'Profil mis à jour',
        text2: 'Vos informations ont été modifiées',
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: message,
      });
      return { success: false, error: message };
    }
  };

  const updateLocation = async (latitude, longitude) => {
    try {
      await api.patch('/auth/update-location', { latitude, longitude });
      return { success: true };
    } catch (error) {
      console.error('Error updating location:', error);
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    updateLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
