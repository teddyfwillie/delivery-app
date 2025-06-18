import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Colors } from '../../../constants/Colors';

/**
 * A reusable input component with various states and features
 * 
 * @param {string} label - Label text for the input
 * @param {string} placeholder - Placeholder text for the input
 * @param {string} value - Current value of the input
 * @param {function} onChangeText - Function to call when text changes
 * @param {string} type - Type of input ('text', 'password', 'email', 'number', 'phone')
 * @param {boolean} isRequired - Whether the input is required
 * @param {boolean} isDisabled - Whether the input is disabled
 * @param {string} error - Error message to display
 * @param {string} helper - Helper text to display below the input
 * @param {string} leftIconName - Name of the Ionicons icon to display on the left
 * @param {string} rightIconName - Name of the Ionicons icon to display on the right
 * @param {function} onRightIconPress - Function to call when the right icon is pressed
 * @param {object} style - Additional styles to apply to the input container
 * @param {object} inputStyle - Additional styles to apply to the TextInput
 */
const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  isRequired = false,
  isDisabled = false,
  error,
  helper,
  leftIconName,
  rightIconName,
  onRightIconPress,
  style,
  inputStyle,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine keyboard type based on input type
  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  // Handle focus state
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine container styles based on state
  const getContainerStyles = () => {
    const baseStyles = [styles.container];
    
    if (isFocused) {
      baseStyles.push(styles.focusedContainer);
    }
    
    if (error) {
      baseStyles.push(styles.errorContainer);
    }
    
    if (isDisabled) {
      baseStyles.push(styles.disabledContainer);
    }
    
    if (colorScheme === 'dark') {
      baseStyles.push(styles.containerDark);
      
      if (isFocused) {
        baseStyles.push(styles.focusedContainerDark);
      }
    }
    
    return baseStyles;
  };

  // Determine input styles based on state
  const getInputStyles = () => {
    const baseStyles = [styles.input];
    
    if (leftIconName) {
      baseStyles.push(styles.inputWithLeftIcon);
    }
    
    if (rightIconName || type === 'password') {
      baseStyles.push(styles.inputWithRightIcon);
    }
    
    if (isDisabled) {
      baseStyles.push(styles.disabledInput);
    }
    
    if (colorScheme === 'dark') {
      baseStyles.push(styles.inputDark);
    }
    
    return baseStyles;
  };

  // Render right icon based on type and props
  const renderRightIcon = () => {
    if (type === 'password') {
      return (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIcon}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colorScheme === 'dark' ? '#FFFFFF' : '#757575'}
          />
        </TouchableOpacity>
      );
    }
    
    if (rightIconName) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.rightIcon}
          disabled={!onRightIconPress}
        >
          <Ionicons
            name={rightIconName}
            size={20}
            color={colorScheme === 'dark' ? '#FFFFFF' : '#757575'}
          />
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              colorScheme === 'dark' && styles.labelDark,
              error && styles.errorLabel,
            ]}
          >
            {label}
          </Text>
          {isRequired && <Text style={styles.requiredMark}>*</Text>}
        </View>
      )}
      
      <View style={getContainerStyles()}>
        {leftIconName && (
          <View style={styles.leftIcon}>
            <Ionicons
              name={leftIconName}
              size={20}
              color={colorScheme === 'dark' ? '#FFFFFF' : '#757575'}
            />
          </View>
        )}
        
        <TextInput
          style={[...getInputStyles(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#A0A0A0' : '#A0A0A0'}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={getKeyboardType()}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          editable={!isDisabled}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {(error || helper) && (
        <Text
          style={[
            styles.helperText,
            error && styles.errorText,
            colorScheme === 'dark' && styles.helperTextDark,
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  labelDark: {
    color: '#FFFFFF',
  },
  requiredMark: {
    color: '#FF5252',
    marginLeft: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 12,
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
    borderColor: '#333333',
  },
  focusedContainer: {
    borderColor: '#FF5252',
  },
  focusedContainerDark: {
    borderColor: '#FF5252',
  },
  errorContainer: {
    borderColor: '#F44336',
  },
  disabledContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  disabledInput: {
    color: '#A0A0A0',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    marginLeft: 4,
  },
  helperTextDark: {
    color: '#A0A0A0',
  },
  errorText: {
    color: '#F44336',
  },
  errorLabel: {
    color: '#F44336',
  },
});

export default Input;
