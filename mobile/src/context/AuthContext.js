import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, supabaseAuth } from '../config/supabase';
import { initializeSocket, disconnectSocket } from '../config/socket';
import Toast from 'react-native-toast-message';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
    
    // Écouter les changements d'authentification Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await supabaseAuth.getUserProfile(session.user.id);
        setUser(profile);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    try {
      const session = await supabaseAuth.getSession();
      
      if (session?.user) {
        const profile = await supabaseAuth.getUserProfile(session.user.id);
        setUser(profile);
        setIsAuthenticated(true);
        initializeSocket(session.access_token);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const data = await supabaseAuth.signUp(
        userData.email,
        userData.password,
        {
          nom: userData.nom,
          prenom: userData.prenom,
          telephone: userData.telephone,
          role: userData.role || 'citizen',
          username: userData.username || `${userData.nom}${userData.prenom}`.toLowerCase(),
          full_name: `${userData.nom} ${userData.prenom}`,
        }
      );

      // Récupérer le profil complet
      const profile = await supabaseAuth.getUserProfile(data.user.id);
      
      setUser(profile);
      setIsAuthenticated(true);
      
      if (data.session?.access_token) {
        initializeSocket(data.session.access_token);
      }

      Toast.show({
        type: 'success',
        text1: 'Bienvenue!',
        text2: 'Compte créé avec succès',
      });

      return { success: true, user: profile };
    } catch (error) {
      const message = error.message || 'Erreur lors de l\'inscription';
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
      const data = await supabaseAuth.signIn(email, password);
      
      // Récupérer le profil complet
      const profile = await supabaseAuth.getUserProfile(data.user.id);

      setUser(profile);
      setIsAuthenticated(true);
      
      if (data.session?.access_token) {
        initializeSocket(data.session.access_token);
      }

      Toast.show({
        type: 'success',
        text1: 'Bienvenue!',
        text2: `Content de vous revoir ${profile.full_name || profile.nom}`,
      });

      return { success: true, user: profile };
    } catch (error) {
      const message = error.message || 'Email ou mot de passe incorrect';
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
      await supabaseAuth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
      const updatedUser = await supabaseAuth.updateProfile(user.id, updates);

      setUser(updatedUser);

      Toast.show({
        type: 'success',
        text1: 'Profil mis à jour',
        text2: 'Vos informations ont été modifiées',
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.message || 'Erreur lors de la mise à jour';
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
      await supabaseAuth.updateLocation(user.id, latitude, longitude);
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
