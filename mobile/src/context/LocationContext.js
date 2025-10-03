import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import { useAuth } from './AuthContext';
import { joinLocationRoom, leaveLocationRoom, updateLocation as updateSocketLocation } from '../config/socket';
import Toast from 'react-native-toast-message';

const LocationContext = createContext({});

export const LocationProvider = ({ children }) => {
  const { isAuthenticated, updateLocation } = useAuth();
  const [location, setLocation] = useState(null);
  const [permission, setPermission] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      requestPermission();
    }
  }, [isAuthenticated]);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status === 'granted');

      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Permission refusée',
          text2: 'Nous avons besoin de votre position pour les urgences',
        });
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = loc.coords;
      setLocation(loc.coords);

      // Update location on server
      if (isAuthenticated) {
        await updateLocation(latitude, longitude);
        joinLocationRoom(latitude, longitude);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible d\'obtenir votre position',
      });
    }
  };

  const startTracking = async () => {
    if (!permission) {
      await requestPermission();
      return;
    }

    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Or when moved 50 meters
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setLocation(loc.coords);

          if (isAuthenticated) {
            updateSocketLocation(latitude, longitude);
          }
        }
      );

      setSubscription(sub);
      setTracking(true);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
      setTracking(false);

      if (location) {
        leaveLocationRoom(location.latitude, location.longitude);
      }
    }
  };

  const value = {
    location,
    permission,
    tracking,
    requestPermission,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
