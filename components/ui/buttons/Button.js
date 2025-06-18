import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Colors } from '../../../constants/Colors';

/**
 * A reusable button component with multiple variants and states
 * 
 * @param {string} variant - The button variant ('primary', 'secondary', 'outline', 'text')
 * @param {string} size - The button size ('small', 'medium', 'large')
 * @param {boolean} isFullWidth - Whether the button should take up the full width
 * @param {boolean} isLoading - Whether the button is in a loading state
 * @param {boolean} isDisabled - Whether the button is disabled
 * @param {string} iconName - Name of the Ionicons icon to display
 * @param {string} iconPosition - Position of the icon ('left', 'right')
 * @param {function} onPress - Function to call when the button is pressed
 * @param {object} style - Additional styles to apply to the button
 * @param {object} textStyle - Additional styles to apply to the button text
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  isLoading = false,
  isDisabled = false,
  iconName,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
  ...props
}) => {
  const colorScheme = useColorScheme();
  
  // Determine button styles based on variant and state
  const getButtonStyles = () => {
    const baseStyles = [styles.button, styles[`${size}Button`]];
    
    if (isFullWidth) {
      baseStyles.push(styles.fullWidth);
    }
    
    if (isDisabled) {
      baseStyles.push(styles.disabledButton);
      return baseStyles;
    }
    
    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButton);
        if (colorScheme === 'dark') {
          baseStyles.push(styles.outlineButtonDark);
        }
        break;
      case 'text':
        baseStyles.push(styles.textButton);
        break;
      case 'primary':
      default:
        baseStyles.push(styles.primaryButton);
        break;
    }
    
    return baseStyles;
  };
  
  // Determine text styles based on variant and state
  const getTextStyles = () => {
    const baseStyles = [styles.buttonText, styles[`${size}Text`]];
    
    if (isDisabled) {
      baseStyles.push(styles.disabledText);
      return baseStyles;
    }
    
    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyles.push(styles.outlineText);
        if (colorScheme === 'dark') {
          baseStyles.push(styles.outlineTextDark);
        }
        break;
      case 'text':
        baseStyles.push(styles.textButtonText);
        if (colorScheme === 'dark') {
          baseStyles.push(styles.textButtonTextDark);
        }
        break;
      case 'primary':
      default:
        baseStyles.push(styles.primaryText);
        break;
    }
    
    return baseStyles;
  };
  
  // Get icon color based on variant
  const getIconColor = () => {
    if (isDisabled) {
      return '#A0A0A0';
    }
    
    switch (variant) {
      case 'secondary':
        return '#FF5252';
      case 'outline':
        return colorScheme === 'dark' ? '#FFFFFF' : '#FF5252';
      case 'text':
        return colorScheme === 'dark' ? '#FFFFFF' : '#FF5252';
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };
  
  // Render button content based on loading state and icon
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={getIconColor()} size={size === 'small' ? 'small' : 'small'} />;
    }
    
    const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    
    if (iconName && iconPosition === 'left') {
      return (
        <View style={styles.contentContainer}>
          <Ionicons name={iconName} size={iconSize} color={getIconColor()} style={styles.leftIcon} />
          <Text style={[...getTextStyles(), textStyle]}>{children}</Text>
        </View>
      );
    }
    
    if (iconName && iconPosition === 'right') {
      return (
        <View style={styles.contentContainer}>
          <Text style={[...getTextStyles(), textStyle]}>{children}</Text>
          <Ionicons name={iconName} size={iconSize} color={getIconColor()} style={styles.rightIcon} />
        </View>
      );
    }
    
    return <Text style={[...getTextStyles(), textStyle]}>{children}</Text>;
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style]}
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  smallButton: {
    height: 32,
    paddingHorizontal: 12,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: 16,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: '#FF5252',
  },
  secondaryButton: {
    backgroundColor: '#FFECEC',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  outlineButtonDark: {
    borderColor: '#FFFFFF',
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 0,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FF5252',
  },
  outlineText: {
    color: '#FF5252',
  },
  outlineTextDark: {
    color: '#FFFFFF',
  },
  textButtonText: {
    color: '#FF5252',
  },
  textButtonTextDark: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#A0A0A0',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;
