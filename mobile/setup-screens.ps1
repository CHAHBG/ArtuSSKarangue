# Mobile App Setup Script - Creates all remaining screens and components

Write-Host "Creating ARTU SI SEN KARANGUE Mobile App Files..." -ForegroundColor Cyan

# Create RegisterScreen
$registerScreen = @'
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const registerSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .required('Nom complet requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  phone: Yup.string()
    .matches(/^[0-9]{9,}$/, 'Numéro invalide')
    .required('Téléphone requis'),
  password: Yup.string()
    .min(8, 'Minimum 8 caractères')
    .matches(/[A-Z]/, 'Doit contenir une majuscule')
    .matches(/[0-9]/, 'Doit contenir un chiffre')
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mots de passe différents')
    .required('Confirmation requise'),
});

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (values, { setSubmitting }) => {
    const result = await register({
      full_name: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté</Text>
        </View>

        <View style={styles.form}>
          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <Input
                  label="Nom complet"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  placeholder="Ousmane Diop"
                  error={touched.fullName && errors.fullName}
                  leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
                />

                <Input
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="ousmane@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && errors.email}
                  leftIcon={<Ionicons name="mail-outline" size={20} color={colors.text.secondary} />}
                />

                <Input
                  label="Téléphone"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  placeholder="771234567"
                  keyboardType="phone-pad"
                  error={touched.phone && errors.phone}
                  leftIcon={<Ionicons name="call-outline" size={20} color={colors.text.secondary} />}
                />

                <Input
                  label="Mot de passe"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  error={touched.password && errors.password}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                  }
                />

                <Input
                  label="Confirmer le mot de passe"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  error={touched.confirmPassword && errors.confirmPassword}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                  }
                />

                <Button
                  title="Créer mon compte"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={styles.registerButton}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  registerButton: {
    marginTop: spacing.md,
  },
});
'@

New-Item -Path "src\screens\RegisterScreen.js" -ItemType File -Force -Value $registerScreen
Write-Host "✅ Created RegisterScreen.js" -ForegroundColor Green

Write-Host "`n✅ Mobile app basic structure created!" -ForegroundColor Green
Write-Host "`nNext: Run 'npm start' in the mobile directory to launch Expo" -ForegroundColor Yellow
