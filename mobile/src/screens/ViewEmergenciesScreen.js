import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, getEmergencyColor, emergencyLabels } from '../theme';
import api from '../config/api';

export default function ViewEmergenciesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('mine'); // 'mine' or 'others'
  const [myEmergencies, setMyEmergencies] = useState([]);
  const [otherEmergencies, setOtherEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      // Load my emergencies
      const myResponse = await api.get('/emergencies/my-emergencies');
      setMyEmergencies(myResponse.data.data || []);

      // Load nearby emergencies (reported by others)
      const nearbyResponse = await api.get('/emergencies/nearby', {
        params: {
          latitude: 14.6928,
          longitude: -17.4467,
          radius: 50000, // 50km
        },
      });
      setOtherEmergencies(nearbyResponse.data.data.emergencies || []);
    } catch (error) {
      console.error('Error loading emergencies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEmergencies();
  };

  const handleEmergencyPress = (emergencyId) => {
    navigation.navigate('EmergencyDetails', { emergencyId });
  };

  const handleDeleteEmergency = async (emergencyId) => {
    try {
      await api.delete(`/emergencies/${emergencyId}`);
      loadEmergencies();
    } catch (error) {
      console.error('Error deleting emergency:', error);
    }
  };

  const renderEmergencyCard = (emergency, showDelete = false) => {
    const emergencyColor = getEmergencyColor(emergency.emergency_type);
    const emergencyLabel = emergencyLabels[emergency.emergency_type] || emergency.emergency_type;

    return (
      <TouchableOpacity
        key={emergency.id}
        style={styles.card}
        onPress={() => handleEmergencyPress(emergency.id)}
      >
        <View style={[styles.cardIcon, { backgroundColor: emergencyColor }]}>
          <Ionicons 
            name={emergency.emergency_type === 'accident' ? 'car-sport' : 
                  emergency.emergency_type === 'medical' ? 'medical' :
                  emergency.emergency_type === 'fire' ? 'flame' : 'alert-circle'} 
            size={24} 
            color={colors.background.paper} 
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{emergencyLabel}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.text.secondary} />
            <Text style={styles.cardLocation} numberOfLines={1}>
              {emergency.location_name || 'Localisation GPS'}
            </Text>
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {emergency.description}
          </Text>
        </View>

        {showDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEmergency(emergency.id)}
          >
            <Ionicons name="trash" size={20} color={colors.error.main} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Urgence</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </SafeAreaView>
    );
  }

  const currentEmergencies = activeTab === 'mine' ? myEmergencies : otherEmergencies;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Urgence</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
            Signaler Par Toi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'others' && styles.activeTab]}
          onPress={() => setActiveTab('others')}
        >
          <Text style={[styles.tabText, activeTab === 'others' && styles.activeTabText]}>
            Signaler Par Les Autres
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentEmergencies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.text.disabled} />
            <Text style={styles.emptyText}>
              {activeTab === 'mine' 
                ? 'Vous n\'avez signalé aucune urgence' 
                : 'Aucune urgence signalée à proximité'}
            </Text>
          </View>
        ) : (
          currentEmergencies.map((emergency) => 
            renderEmergencyCard(emergency, activeTab === 'mine')
          )
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="alert-circle" size={24} color={colors.error.main} />
          <Text style={[styles.navText, styles.navTextActive]}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Community')}>
          <Ionicons name="people-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.navText}>Communauté</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.error.main,
  },
  tabText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  activeTabText: {
    ...typography.subtitle2,
    color: colors.error.main,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...typography.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardLocation: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  cardDescription: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body1,
    color: colors.text.disabled,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {},
  navText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
  },
  navTextActive: {
    color: colors.error.main,
  },
});
