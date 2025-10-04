import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import api from '../config/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography, spacing, borderRadius, shadows, emergencyLabels, wolofMessages } from '../theme';
import Toast from 'react-native-toast-message';

const reportSchema = Yup.object().shape({
  type: Yup.string().required('Type requis'),
  description: Yup.string()
    .min(10, 'Minimum 10 caractères')
    .max(500, 'Maximum 500 caractères')
    .required('Description requise'),
});

const emergencyTypes = [
  { id: 'accident', label: emergencyLabels.accident, icon: 'car', color: colors.accident, wolof: 'Aksidaa' },
  { id: 'fire', label: emergencyLabels.fire, icon: 'flame', color: colors.fire, wolof: 'Safara' },
  { id: 'medical', label: emergencyLabels.medical, icon: 'medical', color: colors.medical, wolof: 'Fàddal Wergu' },
  { id: 'flood', label: emergencyLabels.flood, icon: 'water', color: colors.flood, wolof: 'Ndox' },
  { id: 'security', label: emergencyLabels.security, icon: 'shield', color: colors.security, wolof: 'Sékirite' },
  { id: 'other', label: emergencyLabels.other, icon: 'ellipsis-horizontal', color: colors.other, wolof: 'Yeneen' },
];

export default function ReportScreen({ navigation, route }) {
  const { location, getCurrentLocation } = useLocation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [audioRecording, setAudioRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, stopped
  const [sound, setSound] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingAnimation = useRef(new Animated.Value(0)).current;
  const isSOSMode = route.params?.sos;

  // ===== FONCTIONS AUDIO =====
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès au microphone est nécessaire pour enregistrer');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      setAudioRecording(recording);
      setRecordingStatus('recording');
      setRecordingDuration(0);

      // Animation de pulsation
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Timer pour la durée
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        if (recordingStatus === 'recording') {
          stopRecording();
        }
      }, 300000); // 5 minutes max

    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  };

  const stopRecording = async () => {
    try {
      if (!audioRecording) return;

      setRecordingStatus('stopped');
      await audioRecording.stopAndUnloadAsync();
      
      const uri = audioRecording.getURI();
      setAudioUri(uri);
      setAudioRecording(null);
      
      recordingAnimation.stopAnimation();
      recordingAnimation.setValue(0);

      Toast.show({
        type: 'success',
        text1: 'Enregistrement terminé',
        text2: `Durée: ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de l\'enregistrement:', error);
    }
  };

  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(newSound);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setSound(null);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error('Erreur lors de la lecture audio:', error);
    }
  };

  const deleteAudio = () => {
    Alert.alert(
      'Supprimer l\'enregistrement',
      'Êtes-vous sûr de vouloir supprimer cet enregistrement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setAudioUri(null);
            setRecordingDuration(0);
            setRecordingStatus('idle');
            if (sound) {
              sound.unloadAsync();
              setSound(null);
            }
          },
        },
      ]
    );
  };

  // ===== FONCTIONS IMAGES =====
  const handleImagePick = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert('Limite atteinte', 'Vous pouvez ajouter maximum 3 photos');
      return;
    }

    Alert.alert(
      'Ajouter une photo',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => pickImageFromLibrary() },
        { text: 'Appareil photo', onPress: () => pickImageFromCamera() },
      ]
    );
  };

  const pickImageFromLibrary = async () => {
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

    if (!result.canceled && result.assets[0]) {
      setSelectedImages(prev => [...prev, result.assets[0]]);
    }
  };

  const pickImageFromCamera = async () => {
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

    if (!result.canceled && result.assets[0]) {
      setSelectedImages(prev => [...prev, result.assets[0]]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
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
      setSubmitting(true);

      const reportData = {
        type: values.type,
        description: values.description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        images: selectedImages.map(img => img.uri),
        audioUri: audioUri,
        audioDuration: recordingDuration,
        isSOSMode,
        timestamp: new Date().toISOString(),
      };

      // TODO: Remplacer par l'appel API réel
      // await api.post('/emergencies', reportData);
      
      console.log('Report data:', reportData);

      Toast.show({
        type: 'success',
        text1: isSOSMode ? 'SOS envoyé !' : 'Signalement envoyé',
        text2: 'Les secours ont été alertés',
      });

      // Reset
      resetForm();
      setSelectedImages([]);
      setAudioUri(null);
      setRecordingDuration(0);
      setRecordingStatus('idle');
      
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible d\'envoyer le signalement',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {isSOSMode ? 'Alerte SOS' : wolofMessages.report}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isSOSMode ? 'Karangue bu mag' : 'Teral karangue'}
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
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
                        styles.typeButton,
                        values.type === type.id && styles.typeButtonSelected,
                        { borderColor: type.color }
                      ]}
                      onPress={() => setFieldValue('type', type.id)}
                    >
                      <Ionicons
                        name={type.icon}
                        size={32}
                        color={values.type === type.id ? colors.text.inverse : type.color}
                      />
                      <Text style={[
                        styles.typeLabel,
                        values.type === type.id && styles.typeLabelSelected
                      ]}>
                        {type.label}
                      </Text>
                      <Text style={[
                        styles.typeWolof,
                        values.type === type.id && styles.typeWolofSelected
                      ]}>
                        {type.wolof}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.type && touched.type && (
                  <Text style={styles.error}>{errors.type}</Text>
                )}

                <Text style={styles.sectionTitle}>Description</Text>
                <Input
                  placeholder="Décrivez la situation d'urgence..."
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  error={errors.description && touched.description ? errors.description : null}
                  multiline
                  numberOfLines={4}
                  style={styles.descriptionInput}
                />

                {/* Section Images */}
                <Text style={styles.sectionTitle}>Photos (optionnel)</Text>
                <View style={styles.mediaSection}>
                  <View style={styles.imagesContainer}>
                    {selectedImages.map((image, index) => (
                      <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image.uri }} style={styles.image} />
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close" size={16} color={colors.text.inverse} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    {selectedImages.length < 3 && (
                      <TouchableOpacity
                        style={styles.addMediaButton}
                        onPress={handleImagePick}
                      >
                        <Ionicons name="camera" size={32} color={colors.primary} />
                        <Text style={styles.addMediaText}>Photo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Section Audio */}
                <Text style={styles.sectionTitle}>Enregistrement vocal (optionnel)</Text>
                <View style={styles.audioSection}>
                  {recordingStatus === 'idle' && !audioUri && (
                    <TouchableOpacity
                      style={styles.recordButton}
                      onPress={startRecording}
                    >
                      <Ionicons name="mic" size={32} color={colors.text.inverse} />
                      <Text style={styles.recordButtonText}>Commencer l'enregistrement</Text>
                    </TouchableOpacity>
                  )}

                  {recordingStatus === 'recording' && (
                    <View style={styles.recordingContainer}>
                      <Animated.View style={[
                        styles.recordingIndicator,
                        {
                          opacity: recordingAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1],
                          }),
                        },
                      ]}>
                        <Ionicons name="mic" size={24} color={colors.text.inverse} />
                      </Animated.View>
                      <Text style={styles.recordingText}>
                        Enregistrement... {formatDuration(recordingDuration)}
                      </Text>
                      <TouchableOpacity
                        style={styles.stopButton}
                        onPress={stopRecording}
                      >
                        <Ionicons name="stop" size={24} color={colors.text.inverse} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {audioUri && (
                    <View style={styles.audioPlayerContainer}>
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={playAudio}
                      >
                        <Ionicons 
                          name={sound ? "pause" : "play"} 
                          size={24} 
                          color={colors.text.inverse} 
                        />
                      </TouchableOpacity>
                      <View style={styles.audioInfo}>
                        <Text style={styles.audioTitle}>Enregistrement vocal</Text>
                        <Text style={styles.audioDuration}>
                          Durée: {formatDuration(recordingDuration)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteAudioButton}
                        onPress={deleteAudio}
                      >
                        <Ionicons name="trash" size={20} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Informations de localisation */}
                <View style={styles.locationInfo}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <Text style={styles.locationText}>
                    {location 
                      ? `Position: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                      : 'Localisation en cours...'
                    }
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    title={isSOSMode ? "Envoyer SOS" : "Envoyer le signalement"}
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    variant={isSOSMode ? "danger" : "primary"}
                    icon={<Ionicons name="send" size={20} color={colors.text.inverse} />}
                  />
                </View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sosAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '10',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  sosText: {
    ...typography.body,
    color: colors.danger,
    marginLeft: spacing.md,
    flex: 1,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  typeButton: {
    width: '48%',
    aspectRatio: 1.2,
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
  },
  typeLabel: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  typeLabelSelected: {
    color: colors.text.inverse,
  },
  typeWolof: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  typeWolofSelected: {
    color: colors.text.inverse,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  mediaSection: {
    marginBottom: spacing.lg,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMediaButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },
  addMediaText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  audioSection: {
    marginBottom: spacing.lg,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  recordButtonText: {
    ...typography.button,
    color: colors.text.inverse,
    marginLeft: spacing.md,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  recordingIndicator: {
    backgroundColor: colors.danger + '80',
    borderRadius: borderRadius.full,
    padding: spacing.md,
    marginRight: spacing.md,
  },
  recordingText: {
    ...typography.body,
    color: colors.text.inverse,
    flex: 1,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: spacing.md,
  },
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    padding: spacing.md,
    marginRight: spacing.md,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  audioDuration: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  deleteAudioButton: {
    padding: spacing.sm,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});