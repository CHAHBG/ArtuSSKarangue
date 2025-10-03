import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Button } from '../components/Button';
import Toast from 'react-native-toast-message';

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Distribution de petit-déjeuner à la Mosquée Saint-Joseph de Medina',
      description: '🍞 Repas gratuits disponibles pour ceux qui en ont besoin\n\nSi vous ou quelqu\'un que vous connaissez avez besoin d\'un repas, notre petit-déjeuner, notre cuisine communautaire sert un bruyant gratuit et nutritif.\n\n📍 Lieu : Jeu 13 x 22, Medina, Dakar\n⏰ Horaire : 10h00 - 19h00\n\nAucune inscription nécessaire – venez simplement ! Ensemble, soutenons-nous les uns les autres. ❤️',
      location: 'Jeu 13 x 22, Medina, Dakar',
      date: '01-03-25',
      image: require('../../assets/icon.png'), // Placeholder
      author: 'Ablaye Ndiaye',
    },
    {
      id: 2,
      title: 'Distribution de Ndogou',
      description: 'Distribution gratuite de repas pour le ftour (rupture du jeûne) pendant le Ramadan.',
      location: 'Grand Dakar',
      date: '28-03-25',
      image: require('../../assets/icon.png'), // Placeholder
      author: 'Fatou Diop',
    },
  ]);

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.cardLocation}>
            <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.cardLocationText}>{item.location}</Text>
          </View>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>

        <View style={styles.cardAuthor}>
          <Ionicons name="person-circle-outline" size={20} color={colors.secondary} />
          <Text style={styles.cardAuthorText}>{item.author}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
