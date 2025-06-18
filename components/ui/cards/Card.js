import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Colors } from '../../../constants/Colors';

/**
 * A reusable card component with multiple variants and customization options
 * 
 * @param {string} variant - The card variant ('default', 'elevated', 'outlined')
 * @param {string} title - Card title
 * @param {string} subtitle - Card subtitle
 * @param {string} imageSource - Image source for the card
 * @param {boolean} isInteractive - Whether the card is interactive (clickable)
 * @param {function} onPress - Function to call when the card is pressed
 * @param {object} style - Additional styles to apply to the card
 * @param {object} contentStyle - Additional styles to apply to the card content
 */
const Card = ({
  children,
  variant = 'default',
  title,
  subtitle,
  imageSource,
  isInteractive = false,
  onPress,
  style,
  contentStyle,
  ...props
}) => {
  const colorScheme = useColorScheme();
  
  // Determine card styles based on variant
  const getCardStyles = () => {
    const baseStyles = [styles.card];
    
    switch (variant) {
      case 'elevated':
        baseStyles.push(styles.elevatedCard);
        break;
      case 'outlined':
        baseStyles.push(styles.outlinedCard);
        if (colorScheme === 'dark') {
          baseStyles.push(styles.outlinedCardDark);
        }
        break;
      case 'default':
      default:
        if (colorScheme === 'dark') {
          baseStyles.push(styles.defaultCardDark);
        }
        break;
    }
    
    return baseStyles;
  };
  
  // Render card header with title and subtitle
  const renderHeader = () => {
    if (!title && !subtitle) return null;
    
    return (
      <View style={styles.header}>
        {title && (
          <Text
            style={[
              styles.title,
              colorScheme === 'dark' && styles.titleDark,
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              colorScheme === 'dark' && styles.subtitleDark,
            ]}
            numberOfLines={3}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };
  
  // Render card image
  const renderImage = () => {
    if (!imageSource) return null;
    
    return (
      <View style={styles.imageContainer}>
        <Image
          source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  };
  
  // Render card content
  const renderContent = () => {
    if (!children) return null;
    
    return (
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    );
  };
  
  // Render interactive indicator (right chevron)
  const renderInteractiveIndicator = () => {
    if (!isInteractive) return null;
    
    return (
      <View style={styles.interactiveIndicator}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colorScheme === 'dark' ? '#FFFFFF' : '#757575'}
        />
      </View>
    );
  };
  
  // Render the card as a TouchableOpacity if interactive, otherwise as a View
  const CardComponent = isInteractive ? TouchableOpacity : View;
  const interactiveProps = isInteractive
    ? { onPress, activeOpacity: 0.8 }
    : {};
  
  return (
    <CardComponent
      style={[...getCardStyles(), style]}
      {...interactiveProps}
      {...props}
    >
      {renderImage()}
      {renderHeader()}
      {renderContent()}
      {renderInteractiveIndicator()}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    overflow: 'hidden',
  },
  defaultCardDark: {
    backgroundColor: '#1A1A1A',
  },
  elevatedCard: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  outlinedCardDark: {
    borderColor: '#333333',
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
  subtitleDark: {
    color: '#A0A0A0',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  interactiveIndicator: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});

export default Card;
