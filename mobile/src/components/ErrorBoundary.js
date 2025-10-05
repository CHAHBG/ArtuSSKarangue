/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Ionicons name="alert-circle" size={80} color={colors.danger} />
            
            <Text style={styles.title}>Ndax dëj na!</Text>
            <Text style={styles.subtitle}>Quelque chose s'est mal passé</Text>
            
            <Text style={styles.errorMessage}>
              {this.state.error?.message || 'Une erreur inattendue s\'est produite'}
            </Text>

            <TouchableOpacity 
              style={styles.button}
              onPress={this.handleReset}
            >
              <Ionicons name="refresh" size={20} color={colors.text.inverse} />
              <Text style={styles.buttonText}>Réessayer</Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              Si le problème persiste, veuillez redémarrer l'application.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  subtitle: {
    ...typography.h4,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  errorMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.danger + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  buttonText: {
    ...typography.button,
    color: colors.text.inverse,
    marginLeft: spacing.sm,
  },
  helpText: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ErrorBoundary;
