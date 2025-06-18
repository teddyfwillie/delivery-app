import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Modal,
} from 'react-native';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Colors } from '../../../constants/Colors';

/**
 * A reusable loading indicator component with multiple variants
 * 
 * @param {string} variant - The loading indicator variant ('inline', 'fullscreen', 'overlay')
 * @param {string} size - The size of the loading indicator ('small', 'large')
 * @param {string} color - The color of the loading indicator
 * @param {string} text - Text to display with the loading indicator
 * @param {boolean} visible - Whether the loading indicator is visible (for overlay and fullscreen variants)
 */
const LoadingIndicator = ({
  variant = 'inline',
  size = 'small',
  color,
  text,
  visible = true,
  style,
}) => {
  const colorScheme = useColorScheme();
  
  // Determine indicator color based on props and theme
  const getColor = () => {
    if (color) return color;
    return colorScheme === 'dark' ? '#FFFFFF' : '#FF5252';
  };
  
  // Render inline loading indicator
  const renderInlineIndicator = () => {
    return (
      <View style={[styles.inlineContainer, style]}>
        <ActivityIndicator
          size={size}
          color={getColor()}
        />
        {text && (
          <Text
            style={[
              styles.text,
              colorScheme === 'dark' && styles.textDark,
            ]}
          >
            {text}
          </Text>
        )}
      </View>
    );
  };
  
  // Render fullscreen loading indicator
  const renderFullscreenIndicator = () => {
    return (
      <View
        style={[
          styles.fullscreenContainer,
          colorScheme === 'dark' && styles.fullscreenContainerDark,
          style,
        ]}
      >
        <ActivityIndicator
          size="large"
          color={getColor()}
        />
        {text && (
          <Text
            style={[
              styles.text,
              styles.fullscreenText,
              colorScheme === 'dark' && styles.textDark,
            ]}
          >
            {text}
          </Text>
        )}
      </View>
    );
  };
  
  // Render overlay loading indicator
  const renderOverlayIndicator = () => {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.overlayContainer,
              colorScheme === 'dark' && styles.overlayContainerDark,
              style,
            ]}
          >
            <ActivityIndicator
              size="large"
              color={getColor()}
            />
            {text && (
              <Text
                style={[
                  styles.text,
                  styles.overlayText,
                  colorScheme === 'dark' && styles.textDark,
                ]}
              >
                {text}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  };
  
  // Render the appropriate variant
  switch (variant) {
    case 'fullscreen':
      return visible ? renderFullscreenIndicator() : null;
    case 'overlay':
      return renderOverlayIndicator();
    case 'inline':
    default:
      return visible ? renderInlineIndicator() : null;
  }
};

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  fullscreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  fullscreenContainerDark: {
    backgroundColor: '#121212',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    minWidth: 120,
    minHeight: 120,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlayContainerDark: {
    backgroundColor: '#1A1A1A',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  fullscreenText: {
    marginLeft: 0,
    marginTop: 16,
    fontSize: 16,
  },
  overlayText: {
    marginLeft: 0,
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingIndicator;
