import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import mockDataService from '@/services/mockDataService';

// Define types for our data
interface Category {
  id: string;
  title: string;
  image: any;
}

interface Business {
  id: string;
  title: string;
  category: string;
  time: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  image: any;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  deliveryTypeContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  deliveryTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  deliveryTypeText: {
    fontSize: 16,
    color: '#999',
  },
  activeDeliveryType: {
    // Style for active delivery type button
  },
  activeDeliveryTypeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#000',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  featuredList: {
    paddingLeft: 16,
  },
  featuredItem: {
    marginRight: 16,
    width: 200,
  },
  featuredImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ddd',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  popularItemContainer: {
    width: '50%',
    padding: 8,
  },
  popularItem: {
    width: '100%',
  },
  popularImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ddd',
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceLevel: {
    fontSize: 14,
    marginLeft: 'auto',
  },
});

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [popularBusinesses, setPopularBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Load data when component mounts
    const loadData = async () => {
      try {
        setLoading(true);
        const categories = await mockDataService.getFeaturedCategories();
        const businesses = await mockDataService.getPopularBusinesses();
        
        setFeaturedCategories(categories);
        setPopularBusinesses(businesses);
      } catch (error) {
        console.error('Error loading home screen data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const renderFeaturedItem = ({ item }: { item: Category }) => (
    <Pressable 
      style={styles.featuredItem}
      onPress={() => {
        // Use simple string navigation
        router.push(`/category/${item.id}` as any)
      }}
    >
      <Image source={item.image} style={styles.featuredImage} contentFit="cover" />
      <ThemedText style={styles.featuredTitle}>{item.title}</ThemedText>
    </Pressable>
  );

  const renderPopularItem = ({ item }: { item: Business }) => (
    <Pressable 
      style={styles.popularItem}
      onPress={() => {
        // Use simple string navigation
        router.push(`/business/${item.id}` as any)
      }}
    >
      <Image source={item.image} style={styles.popularImage} contentFit="cover" />
      <ThemedText style={styles.popularTitle}>{item.title}</ThemedText>
      <View style={styles.ratingContainer}>
        <IconSymbol name="star.fill" size={14} color="#FFD700" />
        <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
        <ThemedText style={styles.reviewCount}>({item.reviews})</ThemedText>
        <ThemedText style={styles.priceLevel}>{item.priceLevel}</ThemedText>
      </View>
      <ThemedText style={styles.popularSubtitle}>{item.category} · {item.time}</ThemedText>
    </Pressable>
  );
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      // Navigate to search results if we have at least 3 characters
      // Use simple string navigation
      router.push(`/search?query=${encodeURIComponent(text)}` as any);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#999" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search for stores or items"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Delivery Type Selection */}
          <View style={styles.deliveryTypeContainer}>
            {['Delivery', 'Pickup', 'Catering'].map((type) => (
              <Pressable 
                key={type}
                style={[styles.deliveryTypeButton, deliveryType === type && styles.activeDeliveryType]}
                onPress={() => setDeliveryType(type)}
              >
                <ThemedText 
                  style={[styles.deliveryTypeText, deliveryType === type && styles.activeDeliveryTypeText]}
                >
                  {type}
                </ThemedText>
                {deliveryType === type && <View style={styles.activeIndicator} />}
              </Pressable>
            ))}
          </View>

          {/* Featured Section */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionTitle}>Featured Categories</ThemedText>
            <FlatList
              data={featuredCategories}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>

          {/* Popular Near You Section */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionTitle}>Popular near you</ThemedText>
            <View style={styles.popularGrid}>
              {popularBusinesses.map((item) => (
                <View key={item.id} style={styles.popularItemContainer}>
                  {renderPopularItem({ item })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

