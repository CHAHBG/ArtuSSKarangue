import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import api from '../config/api';
import { listenToEmergencies } from '../config/socket';
import { colors, typography, spacing, borderRadius, shadows, getEmergencyColor, emergencyLabels } from '../theme';
import Toast from 'react-native-toast-message';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { location, getCurrentLocation } = useLocation();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation for SOS button pulsating effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadEmergencies();
    setupSocketListeners();
    startPulseAnimation();
  }, [location]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const setupSocketListeners = () => {
    listenToEmergencies((emergency) => {
      setEmergencies((prev) => [emergency, ...prev]);
      Toast.show({
        type: 'error',
        text1: 'Nouvelle urgence!',
        text2: `${emergencyLabels[emergency.type]} à ${emergency.distance}m`,
      });
    });
  };

  const loadEmergencies = async () => {
    if (!location) {
      await getCurrentLocation();
      return;
    }

    try {
      const response = await api.get('/emergencies/nearby', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 5000, // 5km
        },
      });

      setEmergencies(response.data.data.emergencies);
    } catch (error) {
      console.error('Error loading emergencies:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les urgences',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEmergencies();
  };

  const handleVote = async (emergencyId, currentVotes) => {
    try {
      await api.post(`/emergencies/${emergencyId}/vote`);
      
      setEmergencies((prev) =>
        prev.map((e) =>
          e.id === emergencyId ? { ...e, votes: currentVotes + 1 } : e
        )
      );

      Toast.show({
        type: 'success',
        text1: 'Vote enregistré',
        text2: 'Merci pour votre contribution',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.response?.data?.message || 'Vote impossible',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dalal ak diam,</Text>
          <Text style={styles.name}>{user?.full_name}</Text>
        </View>
        
        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={28} color={colors.text.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Grand bouton SOS circulaire - Style sénégalais */}
        <View style={styles.sosSection}>
          <Text style={styles.sosTitle}>L'aide est à portée de clic !</Text>
          <Text style={styles.sosSubtitle}>
            Cliquer le <Text style={styles.sosHighlight}>bouton SOS</Text> pour appeler à l'aide
          </Text>
          
          <TouchableOpacity
            style={styles.sosButtonContainer}
            onPress={() => navigation.navigate('Report', { sos: true })}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.sosRipple1, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[styles.sosRipple2, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[styles.sosButton, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="warning" size={48} color={colors.text.inverse} />
              <Text style={styles.sosButtonText}>SOS</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Toggle volontariat */}
          <View style={styles.volunteerSection}>
            <Text style={styles.volunteerText}>Se porter volontaire pour aider</Text>
            <TouchableOpacity style={styles.volunteerToggle}>
              <View style={styles.toggleOff}>
                <View style={styles.toggleThumb} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="alert-circle" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{emergencies.length}</Text>
            <Text style={styles.statLabel}>Urgences actives</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="location" size={24} color={colors.success} />
            <Text style={styles.statValue}>
              {location ? '5km' : '---'}
            </Text>
            <Text style={styles.statLabel}>Rayon</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgences à proximité</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ViewEmergencies')}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {emergencies.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              <Text style={styles.emptyTitle}>Tout va bien!</Text>
              <Text style={styles.emptyText}>
                Aucune urgence dans votre zone
              </Text>
            </View>
          ) : (
            emergencies.slice(0, 5).map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
                onVote={handleVote}
                onPress={() => navigation.navigate('EmergencyDetails', { emergencyId: emergency.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EmergencyCard({ emergency, onVote, onPress }) {
  const typeColor = getEmergencyColor(emergency.emergency_type);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.cardBadge, { backgroundColor: typeColor }]}>
        <Text style={styles.cardBadgeText}>{emergencyLabels[emergency.emergency_type]}</Text>
      </View>

      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Ionicons name="alert-circle" size={20} color={typeColor} />
          <Text style={styles.cardTitleText} numberOfLines={1}>
            {emergency.description.substring(0, 50)}...
          </Text>
        </View>
        <Text style={styles.cardTime}>{formatTime(emergency.created_at)}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardLocation}>
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.cardLocationText}>
            {emergency.distance ? `${Math.round(emergency.distance)}m de vous` : 'À proximité'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.voteButton}
          onPress={(e) => {
            e.stopPropagation();
            onVote(emergency.id, emergency.votes || 0);
          }}
        >
          <Ionicons name="arrow-up-circle-outline" size={20} color={colors.primary.main} />
          <Text style={styles.voteText}>{emergency.votes || 0}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return `Il y a ${diff}s`;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)}j`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  greeting: {
    ...typography.body,
    color: colors.secondary,
    fontStyle: 'italic',
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  sosSection: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  sosTitle: {
    ...typography.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sosSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  sosHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  sosButtonContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
    position: 'relative',
  },
  sosRipple1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  sosRipple2: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    shadowColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  sosButtonText: {
    ...typography.h2,
    color: colors.text.inverse,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  volunteerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  volunteerText: {
    ...typography.body,
    color: colors.text.primary,
  },
  volunteerToggle: {
    marginLeft: spacing.md,
  },
  toggleOff: {
    width: 50,
    height: 30,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  statValue: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  viewAllText: {
    ...typography.button,
    color: colors.primary.main,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  cardBadgeText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingRight: spacing.xxl,
  },
  cardTitleText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  cardTime: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLocationText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  voteText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
});
