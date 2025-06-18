import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  
  const navigateToAddresses = () => {
    router.push('/address');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToChangePassword = () => {
    router.push('/change-password');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.headerTitle}>Account</ThemedText>
      <ThemedText style={styles.headerSubtitle}>Manage your profile and settings</ThemedText>
      
      <ScrollView style={styles.menuContainer} contentContainerStyle={styles.menuContent}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={navigateToProfile}
        >
          <Ionicons name="person-outline" size={24} color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.menuItemText}>Profile</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={navigateToAddresses}
        >
          <Ionicons name="location-outline" size={24} color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.menuItemText}>Manage Addresses</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={navigateToChangePassword}
        >
          <Ionicons name="lock-closed-outline" size={24} color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.menuItemText}>Change Password</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginHorizontal: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    marginHorizontal: 20,
    marginBottom: 30,
    opacity: 0.7,
  },
  menuContainer: {
    flex: 1,
    width: '100%',
  },
  menuContent: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
});
