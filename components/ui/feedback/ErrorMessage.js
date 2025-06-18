import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Colors } from '../../../constants/Colors';

/**
 * A reusable error message component with multiple variants
 * 
 * @param {string} variant - The error variant ('inline', 'card', 'fullscreen')
 * @param {string} title - Error title or heading
 * @param {string} message - Error message text
 * @param {string} icon - Icon name from Ionicons
 * @param {function} onRetry - Function to call when retry button is pressed
 * @param {boolean} showRetry - Whether to show a retry button
 */
const ErrorMessage = ({
  variant = 'inline',
  title,
  message,
  icon = 'alert-circle-outline',
  onRetry,
  showRetry = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  
  // Render inline error message
  const renderInlineError = () => {
    return (
      <View style={[styles.inlineContainer, style]}>
        <Ionicons
          name={icon}
          size={16}
          color="#F44336"
        />
        <Text style={styles.inlineText}>{message}</Text>
      </View>
    );
  };
  
  // Render card error message
  const renderCardError = () => {
    return (
      <View
        style={[
          styles.cardContainer,
          colorScheme === 'dark' && styles.cardContainerDark,
          style,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color="#F44336"
        />
        {title && (
          <Text
            style={[
              styles.cardTitle,
              colorScheme === 'dark' && styles.cardTitleDark,
            ]}
          >
            {title}
          </Text>
        )}
        <Text
          style={[
            styles.cardMessage,
            colorScheme === 'dark' && styles.cardMessageDark,
          ]}
        >
          {message}
        </Text>
        {showRetry && onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // Render fullscreen error message
  const renderFullscreenError = () => {
    return (
      <View
        style={[
          styles.fullscreenContainer,
          colorScheme === 'dark' && styles.fullscreenContainerDark,
          style,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={64}
            color="#F44336"
          />
        </View>
        {title && (
          <Text
            style={[
              styles.fullscreenTitle,
              colorScheme === 'dark' && styles.fullscreenTitleDark,
            ]}
          >
            {title}
          </Text>
        )}
        <Text
          style={[
            styles.fullscreenMessage,
            colorScheme === 'dark' && styles.fullscreenMessageDark,
          ]}
        >
          {message}
        </Text>
        {showRetry && onRetry && (
          <TouchableOpacity
            style={styles.fullscreenRetryButton}
            onPress={onRetry}
          >
            <Text style={styles.fullscreenRetryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // Render the appropriate variant
  switch (variant) {
    case 'card':
      return renderCardError();
    case 'fullscreen':
      return renderFullscreenError();
    case 'inline':
    default:
      return renderInlineError();
  }
};

const styles = StyleSheet.create({
  // Inline error styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  inlineText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 4,
  },
  
  // Card error styles
  cardContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardContainerDark: {
    backgroundColor: '#3E2723',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardTitleDark: {
    color: '#EF9A9A',
  },
  cardMessage: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardMessageDark: {
    color: '#EF9A9A',
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Fullscreen error styles
  fullscreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  fullscreenContainerDark: {
    backgroundColor: '#121212',
  },
  iconContainer: {
    marginBottom: 24,
  },
  fullscreenTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 16,
    textAlign: 'center',
  },
  fullscreenTitleDark: {
    color: '#EF9A9A',
  },
  fullscreenMessage: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 24,
  },
  fullscreenMessageDark: {
    color: '#EF9A9A',
  },
  fullscreenRetryButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  fullscreenRetryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorMessage;
