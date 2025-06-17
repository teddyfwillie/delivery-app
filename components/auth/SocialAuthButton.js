import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SocialAuthButton({ title, onPress, iconName, provider }) {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#333333' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#FFFFFF' }, 'text');
  const borderColor = useThemeColor({ light: '#DDDDDD', dark: '#444444' }, 'border');
  
  // Provider-specific colors
  const getIconColor = () => {
    switch (provider) {
      case 'google':
        return '#DB4437';
      case 'facebook':
        return '#4267B2';
      case 'apple':
        return textColor;
      default:
        return textColor;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor }]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Ionicons name={iconName} size={24} color={getIconColor()} style={styles.icon} />
        <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
