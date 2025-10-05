import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Button } from '../components/Button';
import Toast from 'react-native-toast-message';

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      console.log('📦 Loading community posts...');
      const response = await api.get('/community/posts', {
        params: {
          limit: 20,
          offset: 0,
        },
      });

      console.log('✅ Posts loaded:', response.data.data.posts.length);
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error('❌ Error loading posts:', error);
      
      // Show sample posts if API fails (for demo purposes)
      const samplePosts = [
        {
          id: 1,
          title: 'Distribution de petit-déjeuner à la Mosquée Saint-Joseph de Medina',
          description: '🍞 Repas gratuits disponibles pour ceux qui en ont besoin\n\nSi vous ou quelqu\'un que vous connaissez avez besoin d\'un repas, notre petit-déjeuner, notre cuisine communautaire sert un bruyant gratuit et nutritif.\n\n📍 Lieu : Jeu 13 x 22, Medina, Dakar\n⏰ Horaire : 10h00 - 19h00\n\nAucune inscription nécessaire – venez simplement ! Ensemble, soutenons-nous les uns les autres. ❤️',
          location_name: 'Jeu 13 x 22, Medina, Dakar',
          created_at: new Date().toISOString(),
          contact_name: 'Ablaye Ndiaye',
          category: 'food',
        },
        {
          id: 2,
          title: 'Distribution de Ndogou',
          description: 'Distribution gratuite de repas pour le ftour (rupture du jeûne) pendant le Ramadan.',
          location_name: 'Grand Dakar',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          contact_name: 'Fatou Diop',
          category: 'food',
        },
      ];
      setPosts(samplePosts);
      
      Toast.show({
        type: 'info',
        text1: 'Mode démo',
        text2: 'Affichage des posts d\'exemple',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'restaurant',
      clothing: 'shirt',
      medical: 'medical',
      transport: 'car',
      education: 'school',
      other: 'ellipsis-horizontal',
    };
    return icons[category] || 'help-circle';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      food: colors.warning,
      clothing: colors.secondary,
      medical: colors.danger,
      transport: colors.info,
      education: colors.success,
      other: colors.text.secondary,
    };
    return colorMap[category] || colors.text.secondary;
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
        <Ionicons name={getCategoryIcon(item.category)} size={16} color={colors.text.inverse} />
        <Text style={styles.categoryBadgeText}>
          {item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'Autre'}
        </Text>
      </View>

      {/* Image placeholder */}
      <View style={styles.cardImage}>
        <Ionicons 
          name={getCategoryIcon(item.category)} 
          size={60} 
          color={getCategoryColor(item.category)} 
        />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.cardLocation}>
            <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.cardLocationText} numberOfLines={1}>
              {item.location_name || 'Localisation non spécifiée'}
            </Text>
          </View>
          <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
        </View>

        <View style={styles.cardAuthor}>
          <Ionicons name="person-circle-outline" size={20} color={colors.secondary} />
          <Text style={styles.cardAuthorText}>{item.contact_name || 'Anonyme'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post Communautaire</Text>
          <Text style={styles.headerSubtitle}>Jamonoy - Entraide et solidarité</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Chargement des posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post Communautaire</Text>
        <Text style={styles.headerSubtitle}>Jamonoy - Entraide et solidarité</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={80} color={colors.text.disabled} />
            <Text style={styles.emptyTitle}>Aucun post</Text>
            <Text style={styles.emptyText}>
              Soyez le premier à partager avec la communauté !
            </Text>
            <Button
              title="Créer un post"
              onPress={() => navigation.navigate('CreatePost')}
              variant="secondary"
              size="medium"
              style={{ marginTop: spacing.lg }}
            />
          </View>
        )}
      />

      {/* Bouton flottant pour créer un post */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Ionicons name="add" size={32} color={colors.text.inverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.secondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  listContent: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.earth.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    zIndex: 1,
    ...shadows.sm,
  },
  categoryBadgeText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    marginTop: spacing.xxl,
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
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardLocationText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  cardDate: {
    ...typography.caption,
    color: colors.text.disabled,
  },
  cardAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardAuthorText: {
    ...typography.bodySmall,
    color: colors.secondary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  moreButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg + 60, // Au-dessus de la bottom navigation
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    shadowColor: colors.secondary,
  },
});
