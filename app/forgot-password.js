import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();
  
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#121212' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#FFFFFF' }, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666666', dark: '#AAAAAA' }, 'text');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (error) {
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      Alert.alert('Reset Password Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: 'Forgot Password',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: textColor }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
            {resetSent 
              ? 'Check your email for a reset link' 
              : 'Enter your email to receive a password reset link'}
          </Text>
        </View>

        {!resetSent ? (
          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            
            <AuthButton
              title="Send Reset Link"
              onPress={handleResetPassword}
              isLoading={loading}
            />
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={[styles.successText, { color: textColor }]}>
              We've sent a password reset link to:
            </Text>
            <Text style={[styles.emailText, { color: textColor }]}>
              {email}
            </Text>
            <Text style={[styles.instructionText, { color: secondaryTextColor }]}>
              Please check your email and follow the instructions to reset your password.
            </Text>
            
            <AuthButton
              title="Back to Login"
              onPress={() => router.replace('/login')}
              style={{ marginTop: 20 }}
            />
            
            <TouchableOpacity 
              style={styles.resendContainer} 
              onPress={() => {
                setResetSent(false);
                handleResetPassword();
              }}
            >
              <Text style={[styles.resendText, { color: '#FF5A5F' }]}>
                Didn't receive the email? Resend
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: secondaryTextColor }]}>
            Remember your password?
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.footerLink, { color: '#FF5A5F' }]}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
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
  form: {
    width: '100%',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendContainer: {
    marginTop: 20,
    padding: 10,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
