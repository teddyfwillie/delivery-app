import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AuthButton({ title, onPress, isLoading, variant = 'primary', style = {} }) {
  const backgroundColor = useThemeColor({ light: variant === 'primary' ? '#FF5A5F' : '#FFFFFF', dark: variant === 'primary' ? '#FF5A5F' : '#333333' }, 'background');
  const textColor = useThemeColor({ light: variant === 'primary' ? '#FFFFFF' : '#FF5A5F', dark: variant === 'primary' ? '#FFFFFF' : '#FF5A5F' }, 'text');
  const borderColor = useThemeColor({ light: '#FF5A5F', dark: '#FF5A5F' }, 'border');

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        variant === 'secondary' && { borderWidth: 1, borderColor },
        style,
        isLoading && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
