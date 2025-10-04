import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, emergencyLabels, wolofMessages } from '../theme';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function NotificationsScreen({ navigation }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sample data - remplacez par l'API réelle
  const sampleNotifications = [
    {
      id: '1',
      type: 'emergency_nearby',
      title: 'Nouvelle urgence proche',
      message: 'Accident de la route à 150m de votre position',
      emergencyType: 'accident',
      time: '2 min',
      isRead: false,
      distance: '150m',
      icon: 'warning',
    },
    {
      id: '2',
      type: 'help_request',
      title: 'Demande d\'aide',
      message: 'Quelqu\'un a besoin d\'aide dans votre zone',
      emergencyType: 'medical',
      time: '15 min',
      isRead: false,
      distance: '300m',
      icon: 'medical',
    },
    {
      id: '3',
      type: 'community_post',
      title: 'Nouveau post communautaire',
      message: 'Distribution de vivres à Médina - Partagé par Fatou Diop',
      time: '1h',
      isRead: true,
      icon: 'people',
    },
    {
      id: '4',
      type: 'emergency_resolved',
      title: 'Urgence résolue',
      message: 'L\'incendie à Plateau a été maîtrisé par les secours',
      emergencyType: 'fire',
      time: '2h',
      isRead: true,
      icon: 'checkmark-circle',
    },
    {
      id: '5',
      type: 'volunteer_request',
      title: 'Appel aux volontaires',
      message: 'Des bénévoles sont recherchés pour aider aux inondations',
      emergencyType: 'flood',
      time: '3h',
      isRead: true,
      distance: '2km',
      icon: 'hand-left',
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'appel API réel
      // const response = await api.get('/notifications');
      // setNotifications(response.data);
      
      // Pour l'instant, utilisons les données d'exemple
      setNotifications(sampleNotifications);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      Alert.alert('Erreur', 'Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      // TODO: API call pour marquer comme lu
      // await api.patch(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // TODO: API call pour supprimer
      // await api.delete(`/notifications/${notificationId}`);
      
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getNotificationIcon = (type, emergencyType) => {
    switch (type) {
      case 'emergency_nearby':
        return 'warning';
      case 'help_request':
        return 'medical';
      case 'community_post':
        return 'people';
      case 'emergency_resolved':
        return 'checkmark-circle';
      case 'volunteer_request':
        return 'hand-left';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type, emergencyType) => {
    switch (type) {
      case 'emergency_nearby':
      case 'help_request':
        return colors.danger;
      case 'community_post':
        return colors.secondary;
      case 'emergency_resolved':
        return colors.success;
      case 'volunteer_request':
        return colors.warning;
      default:
        return colors.text.secondary;
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigation selon le type
    switch (notification.type) {
      case 'emergency_nearby':
      case 'help_request':
        navigation.navigate('Map');
        break;
      case 'community_post':
        navigation.navigate('Community');
        break;
      case 'emergency_resolved':
        // Afficher les détails de l'urgence résolue
        break;
      case 'volunteer_request':
        navigation.navigate('Community');
        break;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(item.type, item.emergencyType) + '20' }
        ]}>
          <Ionicons
            name={getNotificationIcon(item.type, item.emergencyType)}
            size={24}
            color={getNotificationColor(item.type, item.emergencyType)}
          />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[
              styles.title,
              !item.isRead && styles.unreadTitle
            ]}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>

          {item.distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={12} color={colors.text.secondary} />
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Supprimer la notification',
              'Êtes-vous sûr de vouloir supprimer cette notification ?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => deleteNotification(item.id) },
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {!item.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-outline" size={80} color={colors.text.disabled} />
      <Text style={styles.emptyTitle}>Aucune notification</Text>
      <Text style={styles.emptyText}>
        Vous recevrez ici les alertes d'urgence et les mises à jour de votre communauté
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{wolofMessages.notifications}</Text>
          <Text style={styles.headerSubtitle}>Begg-begg yu ci kanam</Text>
        </View>

        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  markAllButton: {
    padding: spacing.sm,
  },
  markAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    overflow: 'hidden',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  time: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  message: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  distance: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs / 2,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  unreadIndicator: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});