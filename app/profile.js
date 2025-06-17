import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProfileScreen() {
  const { currentUser, userType, updateUserProfile, logout } = useAuth();
  const [resendingVerification, setResendingVerification] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#121212' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#FFFFFF' }, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666666', dark: '#AAAAAA' }, 'text');
  const cardBgColor = useThemeColor({ light: '#F5F5F5', dark: '#2A2A2A' }, 'background');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        fullName,
        phoneNumber,
        address
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'customer':
        return 'Customer';
      case 'business':
        return 'Business Owner';
      case 'driver':
        return 'Delivery Driver';
      default:
        return 'User';
    }
  };

  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <StatusBar style="auto" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {currentUser.photoURL ? (
              <Image 
                source={{ uri: currentUser.photoURL }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: '#FF5A5F' }]}>
                <Text style={styles.profileImagePlaceholderText}>
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            {!isEditing && (
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[styles.userName, { color: textColor }]}>{fullName || 'User'}</Text>
          <View style={[styles.userTypeTag, { backgroundColor: '#FF5A5F' }]}>
            <Text style={styles.userTypeText}>{getUserTypeLabel()}</Text>
          </View>
          <Text style={[styles.userEmail, { color: secondaryTextColor }]}>{currentUser.email}</Text>
        </View>

        {isEditing ? (
          <View style={styles.form}>
            <AuthInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />
            
            <AuthInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            
            <AuthInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
            />
            
            <View style={styles.buttonGroup}>
              <AuthButton
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <AuthButton
                title="Save Changes"
                onPress={handleUpdateProfile}
                isLoading={loading}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <View style={[styles.infoCard, { backgroundColor: cardBgColor }]}>
              <Text style={[styles.infoCardTitle, { color: secondaryTextColor }]}>Account Information</Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#FF5A5F" />
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Name:</Text>
                <Text style={[styles.infoValue, { color: textColor }]}>{fullName || 'Not set'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#FF5A5F" />
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Email:</Text>
                <Text style={[styles.infoValue, { color: textColor }]}>{currentUser.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#FF5A5F" />
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Phone:</Text>
                <Text style={[styles.infoValue, { color: textColor }]}>{phoneNumber || 'Not set'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#FF5A5F" />
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Address:</Text>
                <Text style={[styles.infoValue, { color: textColor }]}>{address || 'Not set'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#FF5A5F" />
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Verified:</Text>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {currentUser.emailVerified ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
            
            {!currentUser.emailVerified && (
              <View style={[styles.verificationCard, { backgroundColor: '#FFF3CD' }]}>
                <Ionicons name="warning-outline" size={24} color="#856404" />
                <Text style={styles.verificationText}>
                  Please verify your email address to access all features.
                </Text>
                <TouchableOpacity 
                  style={styles.verificationButton}
                  onPress={async () => {
                    try {
                      setResendingVerification(true);
                      await sendEmailVerification(currentUser);
                      Alert.alert('Success', 'Verification email has been sent to your email address.');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to send verification email. Please try again later.');
                      console.error(error);
                    } finally {
                      setResendingVerification(false);
                    }
                  }}
                  disabled={resendingVerification}
                >
                  <Text style={styles.verificationButtonText}>
                    {resendingVerification ? 'Sending...' : 'Resend Verification'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: cardBgColor }]}
                onPress={() => router.push('/change-password')}
              >
                <Ionicons name="key-outline" size={24} color="#FF5A5F" />
                <Text style={[styles.actionButtonText, { color: textColor }]}>Change Password</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: cardBgColor }]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#FF5A5F" />
                <Text style={[styles.actionButtonText, { color: textColor }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF5A5F',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  userTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 16,
  },
  profileInfo: {
    width: '100%',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 8,
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  verificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  verificationText: {
    color: '#856404',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  verificationButton: {
    marginTop: 8,
    marginLeft: 32,
  },
  verificationButtonText: {
    color: '#FF5A5F',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
