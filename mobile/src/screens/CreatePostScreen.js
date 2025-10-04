import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors, typography, spacing, borderRadius, shadows, wolofMessages } from '../theme';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const POST_CATEGORIES = [
  { id: 'food', label: 'Nourriture', wolof: 'Lekk', icon: 'restaurant', color: colors.warning },
  { id: 'clothing', label: 'Vêtements', wolof: 'Rad', icon: 'shirt', color: colors.secondary },
  { id: 'medical', label: 'Médical', wolof: 'Fàddal', icon: 'medical', color: colors.danger },
  { id: 'transport', label: 'Transport', wolof: 'Takk', icon: 'car', color: colors.info },
  { id: 'education', label: 'Éducation', wolof: 'Jàng', icon: 'school', color: colors.success },
  { id: 'other', label: 'Autre', wolof: 'Yeneen', icon: 'ellipsis-horizontal', color: colors.text.secondary },
];

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [post, setPost] = useState({
    title: '',
    description: '',
    category: '',
    location: null,
    locationName: '',
    images: [],
    contactPhone: '',
    contactName: user?.name || '',
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const handleImagePicker = async () => {
    if (post.images.length >= 3) {
      Alert.alert('Limite atteinte', 'Vous pouvez ajouter maximum 3 photos');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'L\'accès à la galerie est nécessaire pour ajouter des photos');
      return;
    }

    Alert.alert(
      'Ajouter une photo',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => pickImage('library') },
        { text: 'Appareil photo', onPress: () => pickImage('camera') },
      ]
    );
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission requise', 'L\'accès à l\'appareil photo est nécessaire');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setPost(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0]]
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la photo');
    }
  };

  const removeImage = (index) => {
    setPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès à la localisation est nécessaire');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = reverseGeocode[0];
      const locationName = `${address.street || ''} ${address.district || ''}, ${address.city || ''}`.trim();

      setPost(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        locationName: locationName || 'Position actuelle',
      }));
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    } finally {
      setLocationLoading(false);
    }
  };

  const validatePost = () => {
    if (!post.title.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir un titre pour votre post');
      return false;
    }
    
    if (!post.description.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir une description');
      return false;
    }
    
    if (!post.category) {
      Alert.alert('Champ requis', 'Veuillez sélectionner une catégorie');
      return false;
    }
    
    if (!post.contactPhone.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir un numéro de contact');
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    try {
      setLoading(true);

      // TODO: Upload des images vers le serveur
      // const imageUrls = await uploadImages(post.images);

      const postData = {
        title: post.title.trim(),
        description: post.description.trim(),
        category: post.category,
        location: post.location,
        locationName: post.locationName,
        contactPhone: post.contactPhone.trim(),
        contactName: post.contactName.trim(),
        // images: imageUrls,
        images: post.images.map(img => img.uri), // Pour le moment, on garde les URIs locales
        userId: user.id,
        author: user.name,
      };

      // TODO: Envoyer au serveur
      // await api.post('/community/posts', postData);

      Alert.alert(
        'Post publié !',
        'Votre post communautaire a été publié avec succès',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              // TODO: Refresh du feed communautaire
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      Alert.alert('Erreur', 'Impossible de publier le post. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 9) {
      return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)}`.trim();
    }
    return text;
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        post.category === category.id && styles.categoryButtonSelected,
        { borderColor: category.color }
      ]}
      onPress={() => setPost(prev => ({ ...prev, category: category.id }))}
    >
      <Ionicons
        name={category.icon}
        size={24}
        color={post.category === category.id ? colors.text.inverse : category.color}
      />
      <Text style={[
        styles.categoryLabel,
        post.category === category.id && styles.categoryLabelSelected
      ]}>
        {category.label}
      </Text>
      <Text style={[
        styles.categoryWolof,
        post.category === category.id && styles.categoryWolofSelected
      ]}>
        {category.wolof}
      </Text>
    </TouchableOpacity>
  );

  const renderImage = (image, index) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri: image.uri }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}
      >
        <Ionicons name="close" size={20} color={colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Créer un post</Text>
            <Text style={styles.headerSubtitle}>{wolofMessages.community} post</Text>
          </View>

          <TouchableOpacity
            style={[styles.publishButton, loading && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={loading}
          >
            <Text style={styles.publishButtonText}>
              {loading ? 'En cours...' : 'Publier'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Titre */}
          <View style={styles.section}>
            <Text style={styles.label}>Titre du post *</Text>
            <TextInput
              style={styles.titleInput}
              value={post.title}
              onChangeText={(text) => setPost(prev => ({ ...prev, title: text }))}
              placeholder="Ex: Distribution de vivres à Médina"
              placeholderTextColor={colors.text.disabled}
              maxLength={100}
            />
            <Text style={styles.charCount}>{post.title.length}/100</Text>
          </View>

          {/* Catégorie */}
          <View style={styles.section}>
            <Text style={styles.label}>Catégorie *</Text>
            <View style={styles.categoriesGrid}>
              {POST_CATEGORIES.map(renderCategoryButton)}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.descriptionInput}
              value={post.description}
              onChangeText={(text) => setPost(prev => ({ ...prev, description: text }))}
              placeholder="Décrivez votre initiative, ce que vous proposez ou ce dont vous avez besoin..."
              placeholderTextColor={colors.text.disabled}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>{post.description.length}/500</Text>
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <Text style={styles.label}>Photos (optionnel)</Text>
            <Text style={styles.sublabel}>Ajoutez jusqu'à 3 photos pour illustrer votre post</Text>
            
            <View style={styles.imagesContainer}>
              {post.images.map(renderImage)}
              
              {post.images.length < 3 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="camera" size={32} color={colors.text.secondary} />
                  <Text style={styles.addImageText}>Ajouter photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Localisation */}
          <View style={styles.section}>
            <Text style={styles.label}>Localisation</Text>
            <Text style={styles.sublabel}>Où se déroule votre initiative ?</Text>
            
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={locationLoading}
            >
              <Ionicons 
                name={locationLoading ? "reload" : "location"} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.locationButtonText}>
                {locationLoading ? 'Localisation...' : 
                 post.locationName ? post.locationName : 'Obtenir ma position'}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={post.locationName}
              onChangeText={(text) => setPost(prev => ({ ...prev, locationName: text }))}
              placeholder="Ou saisissez l'adresse manuellement"
              placeholderTextColor={colors.text.disabled}
            />
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.label}>Informations de contact *</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.sublabel}>Nom de contact</Text>
              <TextInput
                style={styles.textInput}
                value={post.contactName}
                onChangeText={(text) => setPost(prev => ({ ...prev, contactName: text }))}
                placeholder="Votre nom ou nom de l'organisation"
                placeholderTextColor={colors.text.disabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.sublabel}>Numéro de téléphone</Text>
              <TextInput
                style={styles.textInput}
                value={post.contactPhone}
                onChangeText={(text) => setPost(prev => ({ 
                  ...prev, 
                  contactPhone: formatPhoneNumber(text) 
                }))}
                placeholder="77 123 45 67"
                placeholderTextColor={colors.text.disabled}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Information */}
          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={20} color={colors.secondary} />
            <Text style={styles.infoText}>
              Votre post sera visible par tous les membres de la communauté. 
              Assurez-vous que vos informations de contact sont correctes.
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  publishButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  publishButtonDisabled: {
    backgroundColor: colors.text.disabled,
  },
  publishButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  sublabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  charCount: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    aspectRatio: 1.5,
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primary,
  },
  categoryLabel: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: colors.text.inverse,
  },
  categoryWolof: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  categoryWolofSelected: {
    color: colors.text.inverse,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    height: 120,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },
  addImageText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  locationButtonText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondary + '10',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});