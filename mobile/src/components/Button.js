import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    styles[`buttonText_${size}`],
    disabled && styles.buttonText_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.text.inverse : colors.primary} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_danger: {
    backgroundColor: colors.danger,
  },
  button_success: {
    backgroundColor: colors.success,
  },
  button_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  button_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  button_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  button_disabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    textAlign: 'center',
  },
  buttonText_primary: {
    color: colors.text.inverse,
  },
  buttonText_secondary: {
    color: colors.text.primary,
  },
  buttonText_outline: {
    color: colors.primary,
  },
  buttonText_danger: {
    color: colors.text.inverse,
  },
  buttonText_success: {
    color: colors.text.inverse,
  },
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },
  buttonText_disabled: {
    opacity: 0.7,
  },
});
