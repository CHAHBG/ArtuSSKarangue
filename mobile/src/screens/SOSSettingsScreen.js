import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, typography, spacing, borderRadius, shadows, wolofMessages } from '../theme';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function SOSSettingsScreen({ navigation }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    alertRadius: 5, // en kilomètres
    emergencyContact: '',
    emergencyContactName: '',
    autoAlert: true,
    soundEnabled: true,
    vibrationEnabled: true,
    shareLocation: true,
    allowVolunteers: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Charger depuis l'API
      // const response = await api.get('/user/sos-settings');
      // setSettings(response.data);
      
      // Pour l'instant, paramètres par défaut
      console.log('Paramètres SOS chargés');
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (settings.emergencyContact && !isValidPhoneNumber(settings.emergencyContact)) {
        Alert.alert('Erreur', 'Numéro de téléphone invalide');
        return;
      }

      // TODO: Sauvegarder via API
      // await api.put('/user/sos-settings', settings);
      
      Alert.alert(
        'Paramètres sauvegardés',
        'Vos paramètres SOS ont été mis à jour avec succès',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const isValidPhoneNumber = (phone) => {
    // Validation basique pour numéros sénégalais
    const senegalRegex = /^(\+221|221)?[733|76|77|78|70][0-9]{7}$/;
    return senegalRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (text) => {
    // Format automatique pour numéros sénégalais
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('221')) {
      const number = cleaned.substring(3);
      if (number.length <= 9) {
        return `+221 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7, 9)}`.trim();
      }
    } else if (cleaned.length <= 9) {
      return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)}`.trim();
    }
    return text;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setSettings(prev => ({ ...prev, emergencyContact: formatted }));
  };

  const testEmergencyContact = () => {
    if (!settings.emergencyContact) {
      Alert.alert('Erreur', 'Veuillez d\'abord saisir un numéro d\'urgence');
      return;
    }

    Alert.alert(
      'Test du contact d\'urgence',
      `Un SMS de test sera envoyé au ${settings.emergencyContact}.\n\nContinuer ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: () => {
            // TODO: Envoyer SMS de test
            Alert.alert('SMS envoyé', 'Un message de test a été envoyé à votre contact d\'urgence');
          }
        }
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Paramètres SOS</Text>
          <Text style={styles.headerSubtitle}>Làmmiñ ak karangue</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={saveSettings}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'En cours...' : 'Sauver'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rayon d'alerte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rayon d'alerte</Text>
          <Text style={styles.sectionSubtitle}>Définissez la distance pour recevoir les alertes</Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Distance</Text>
              <Text style={styles.sliderValue}>{settings.alertRadius} km</Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={20}
              step={1}
              value={settings.alertRadius}
              onValueChange={(value) => setSettings(prev => ({ ...prev, alertRadius: value }))}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbStyle={{ backgroundColor: colors.primary }}
            />
            
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>1 km</Text>
              <Text style={styles.sliderLabelText}>20 km</Text>
            </View>
          </View>

          <View style={styles.radiusInfo}>
            <Ionicons name="information-circle" size={16} color={colors.warning} />
            <Text style={styles.radiusInfoText}>
              Plus le rayon est large, plus vous recevrez d'alertes
            </Text>
          </View>
        </View>

        {/* Contact d'urgence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact d'urgence</Text>
          <Text style={styles.sectionSubtitle}>Personne à prévenir en cas d'urgence</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom du contact</Text>
            <TextInput
              style={styles.textInput}
              value={settings.emergencyContactName}
              onChangeText={(text) => setSettings(prev => ({ ...prev, emergencyContactName: text }))}
              placeholder="Ex: Papa, Maman, Frère..."
              placeholderTextColor={colors.text.disabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Numéro de téléphone</Text>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                value={settings.emergencyContact}
                onChangeText={handlePhoneChange}
                placeholder="+221 77 123 45 67"
                placeholderTextColor={colors.text.disabled}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={styles.testButton}
                onPress={testEmergencyContact}
              >
                <Ionicons name="send" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Options d'alerte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options d'alerte</Text>
          
          <View style={styles.switchOption}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Alerte automatique</Text>
              <Text style={styles.switchDescription}>
                Envoyer automatiquement votre position en cas d'urgence
              </Text>
            </View>
            <Switch
              value={settings.autoAlert}
              onValueChange={(value) => setSettings(prev => ({ ...prev, autoAlert: value }))}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={settings.autoAlert ? colors.primary : colors.text.disabled}
            />
          </View>

          <View style={styles.switchOption}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Son d'alerte</Text>
              <Text style={styles.switchDescription}>
                Émettre un son lors des alertes
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => setSettings(prev => ({ ...prev, soundEnabled: value }))}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={settings.soundEnabled ? colors.primary : colors.text.disabled}
            />
          </View>

          <View style={styles.switchOption}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Vibration</Text>
              <Text style={styles.switchDescription}>
                Faire vibrer le téléphone lors des alertes
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => setSettings(prev => ({ ...prev, vibrationEnabled: value }))}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={settings.vibrationEnabled ? colors.primary : colors.text.disabled}
            />
          </View>
        </View>

        {/* Confidentialité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité</Text>
          
          <View style={styles.switchOption}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Partager ma position</Text>
              <Text style={styles.switchDescription}>
                Permettre aux secours de voir votre localisation
              </Text>
            </View>
            <Switch
              value={settings.shareLocation}
              onValueChange={(value) => setSettings(prev => ({ ...prev, shareLocation: value }))}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={settings.shareLocation ? colors.primary : colors.text.disabled}
            />
          </View>

          <View style={styles.switchOption}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Accepter les volontaires</Text>
              <Text style={styles.switchDescription}>
                Permettre aux bénévoles de vous aider
              </Text>
            </View>
            <Switch
              value={settings.allowVolunteers}
              onValueChange={(value) => setSettings(prev => ({ ...prev, allowVolunteers: value }))}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={settings.allowVolunteers ? colors.primary : colors.text.disabled}
            />
          </View>
        </View>

        {/* Zone d'information */}
        <View style={styles.infoSection}>
          <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
          <Text style={styles.infoText}>
            Vos données personnelles sont protégées et ne sont utilisées qu'en cas d'urgence.
            Les bénévoles ne voient que votre position approximative.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.text.disabled,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  sliderContainer: {
    marginTop: spacing.md,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sliderLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  sliderValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  slider: {
    height: 40,
    marginHorizontal: -spacing.sm,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sliderLabelText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  radiusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.warning + '10',
    borderRadius: borderRadius.sm,
  },
  radiusInfoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    marginRight: spacing.md,
  },
  testButton: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  switchContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondary + '10',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});