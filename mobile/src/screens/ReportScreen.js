import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import api from '../config/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography, spacing, borderRadius, shadows, emergencyLabels } from '../theme';
import Toast from 'react-native-toast-message';

const reportSchema = Yup.object().shape({
  type: Yup.string().required('Type requis'),
  description: Yup.string()
    .min(10, 'Minimum 10 caractères')
    .max(500, 'Maximum 500 caractères')
    .required('Description requise'),
});

const emergencyTypes = [
  { id: 'accident', label: 'Accident', icon: 'car', color: '#F59E0B' },
  { id: 'fire', label: 'Safara', icon: 'flame', color: '#DC2626' },
  { id: 'medical', label: 'Médical', icon: 'medical', color: '#EF4444' },
  { id: 'flood', label: 'Ndox', icon: 'water', color: '#3B82F6' },
  { id: 'security', label: 'Sécurité', icon: 'shield', color: '#7C3AED' },
  { id: 'other', label: 'Yeneen', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

export default function ReportScreen({ navigation, route }) {
  const { location, getCurrentLocation } = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);
  const isSOSMode = route.params?.sos;

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission refusée', 'Autoriser l\'accès aux photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleCameraLaunch = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission refusée', 'Autoriser l\'accès à la caméra');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!location) {
      Toast.show({
        type: 'error',
        text1: 'Position requise',
        text2: 'Activation du GPS en cours...',
      });
      await getCurrentLocation();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('type', values.type);
      formData.append('description', values.description);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      
      if (selectedImage) {
        formData.append('media', {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: 'emergency.jpg',
        });
      }

      await api.post('/emergencies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Urgence signalée!',
        text2: 'L\'aide est en route',
      });

      resetForm();
      setSelectedImage(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error reporting emergency:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.response?.data?.message || 'Impossible de signaler',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isSOSMode ? 'Alerte SOS' : 'Signaler une urgence'}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {isSOSMode && (
            <View style={styles.sosAlert}>
              <Ionicons name="warning" size={32} color={colors.danger} />
              <Text style={styles.sosText}>
                Mode SOS activé - Votre position sera partagée immédiatement
              </Text>
            </View>
          )}

          <Formik
            initialValues={{
              type: isSOSMode ? 'other' : '',
              description: isSOSMode ? 'Situation d\'urgence - Besoin d\'aide immédiate' : '',
            }}
            validationSchema={reportSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
              <>
                <Text style={styles.sectionTitle}>Type d'urgence</Text>
                <View style={styles.typesGrid}>
                  {emergencyTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeCard,
                        values.type === type.id && { 
                          borderColor: type.color,
                          borderWidth: 2,
                          backgroundColor: `${type.color}10`,
                        },
                      ]}
                      onPress={() => setFieldValue('type', type.id)}
                    >
                      <Ionicons
                        name={type.icon}
                        size={32}
                        color={values.type === type.id ? type.color : colors.text.secondary}
                      />
                      <Text
                        style={[
                          styles.typeLabel,
                          values.type === type.id && { color: type.color, fontWeight: '600' },
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.type && errors.type && (
                  <Text style={styles.error}>{errors.type}</Text>
                )}

                <Text style={styles.sectionTitle}>Description</Text>
                <Input
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  placeholder="Décrivez la situation..."
                  multiline
                  numberOfLines={4}
                  error={touched.description && errors.description}
                />

                <Text style={styles.sectionTitle}>Photo (optionnel)</Text>
                <View style={styles.mediaButtons}>
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={handleCameraLaunch}
                  >
                    <Ionicons name="camera" size={24} color={colors.primary} />
                    <Text style={styles.mediaButtonText}>Prendre une photo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={handleImagePick}
                  >
                    <Ionicons name="images" size={24} color={colors.primary} />
                    <Text style={styles.mediaButtonText}>Galerie</Text>
                  </TouchableOpacity>
                </View>

                {selectedImage && (
                  <View style={styles.imagePreview}>
                    <Text style={styles.imagePreviewText}>✓ Photo sélectionnée</Text>
                    <TouchableOpacity onPress={() => setSelectedImage(null)}>
                      <Ionicons name="close-circle" size={24} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.locationInfo}>
                  <Ionicons name="location" size={20} color={colors.success} />
                  <Text style={styles.locationText}>
                    {location
                      ? `Position: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                      : 'Position GPS non disponible'}
                  </Text>
                </View>

                <Button
                  title={isSOSMode ? 'Envoyer SOS' : 'Signaler l\'urgence'}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting || !location}
                  variant={isSOSMode ? 'danger' : 'primary'}
                  style={styles.submitButton}
                />
              </>
            )}
          </Formik>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sosAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.danger}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sosText: {
    ...typography.bodySmall,
    color: colors.danger,
    marginLeft: spacing.md,
    flex: 1,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  typeCard: {
    width: '31%',
    aspectRatio: 1,
    margin: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  typeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
  },
  mediaButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${colors.success}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  imagePreviewText: {
    ...typography.body,
    color: colors.success,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}10`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  locationText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  submitButton: {
    marginBottom: spacing.xxl,
  },
});
