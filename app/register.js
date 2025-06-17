import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import SocialAuthButton from '../components/auth/SocialAuthButton';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('customer'); // Default to customer
  const [loading, setLoading] = useState(false);
  const { register, signInWithGoogle, signInWithFacebook } = useAuth();
  const router = useRouter();
  
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#121212' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#FFFFFF' }, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666666', dark: '#AAAAAA' }, 'text');
  const accentColor = '#FF5A5F';

  const handleRegister = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(email, password, fullName, userType);
      Alert.alert(
        'Registration Successful',
        'Please verify your email before logging in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login')
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'Failed to create an account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please use a different email or try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Google Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      await signInWithFacebook();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Facebook Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const UserTypeButton = ({ type, title }) => (
    <TouchableOpacity
      style={[
        styles.userTypeButton,
        userType === type && { backgroundColor: accentColor }
      ]}
      onPress={() => setUserType(type)}
    >
      <Text
        style={[
          styles.userTypeText,
          userType === type && { color: '#FFFFFF' }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: 'Register',
          headerShown: false,
        }}
      />
      <StatusBar style="auto" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: textColor }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
            Sign up to get started with DDelivery
          </Text>
        </View>

        <View style={styles.userTypeContainer}>
          <Text style={[styles.userTypeLabel, { color: textColor }]}>I am a:</Text>
          <View style={styles.userTypeButtons}>
            <UserTypeButton type="customer" title="Customer" />
            <UserTypeButton type="business" title="Business" />
            <UserTypeButton type="driver" title="Driver" />
          </View>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          
          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />
          
          <AuthInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />
          
          <AuthButton
            title="Create Account"
            onPress={handleRegister}
            isLoading={loading}
          />
          
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: secondaryTextColor }]} />
            <Text style={[styles.dividerText, { color: secondaryTextColor }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: secondaryTextColor }]} />
          </View>
          
          <SocialAuthButton
            title="Continue with Google"
            iconName="logo-google"
            provider="google"
            onPress={handleGoogleSignIn}
          />
          
          <SocialAuthButton
            title="Continue with Facebook"
            iconName="logo-facebook"
            provider="facebook"
            onPress={handleFacebookSignIn}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: secondaryTextColor }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.footerLink, { color: '#FF5A5F' }]}> Sign In</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  form: {
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
