import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
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
  categoryId: string;
  time: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  image: any;
  description: string;
}

export default function BrowseScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load all categories
        const allCategories = await mockDataService.getCategories();
        setCategories(allCategories);
        
        // Load all businesses initially
        const allBusinesses = await mockDataService.getAllBusinesses();
        setBusinesses(allBusinesses);
      } catch (error) {
        console.error('Error loading browse data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter businesses when category changes
  useEffect(() => {
    const filterBusinesses = async () => {
      try {
        setLoading(true);
        
        if (selectedCategory) {
          // Filter businesses by selected category
          const filteredBusinesses = await mockDataService.getBusinessesByCategory(selectedCategory);
          setBusinesses(filteredBusinesses);
        } else {
          // If no category is selected, show all businesses
          const allBusinesses = await mockDataService.getAllBusinesses();
          setBusinesses(allBusinesses);
        }
      } catch (error) {
        console.error('Error filtering businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    filterBusinesses();
  }, [selectedCategory]);
  
  // Handle search input
  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    
    if (text.length >= 2) {
      try {
        setLoading(true);
        const searchResults = await mockDataService.searchBusinesses(text);
        setBusinesses(searchResults);
      } catch (error) {
        console.error('Error searching businesses:', error);
      } finally {
        setLoading(false);
      }
    } else if (text.length === 0) {
      // Reset to filtered by category or all if no category selected
      if (selectedCategory) {
        const filteredBusinesses = await mockDataService.getBusinessesByCategory(selectedCategory);
        setBusinesses(filteredBusinesses);
      } else {
        const allBusinesses = await mockDataService.getAllBusinesses();
        setBusinesses(allBusinesses);
      }
    }
  };
  
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Pressable 
      style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategoryItem]}
      onPress={() => {
        // Toggle category selection
        setSelectedCategory(selectedCategory === item.id ? null : item.id);
      }}
    >
      <Image source={item.image} style={styles.categoryImage} contentFit="cover" />
      <ThemedText style={[styles.categoryTitle, selectedCategory === item.id && styles.selectedCategoryTitle]}>
        {item.title}
      </ThemedText>
    </Pressable>
  );
  
  const renderBusinessItem = ({ item }: { item: Business }) => (
    <Pressable 
      style={styles.businessItem}
      onPress={() => {
        // Navigate to business detail page
        router.push(`/business/${item.id}` as any);
      }}
    >
      <Image source={item.image} style={styles.businessImage} contentFit="cover" />
      <View style={styles.businessContent}>
        <ThemedText style={styles.businessTitle}>{item.title}</ThemedText>
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={14} color="#FFD700" />
          <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
          <ThemedText style={styles.reviewCount}>({item.reviews})</ThemedText>
          <ThemedText style={styles.priceLevel}>{item.priceLevel}</ThemedText>
        </View>
        <ThemedText style={styles.businessSubtitle}>{item.category} · {item.time}</ThemedText>
        <ThemedText numberOfLines={2} style={styles.businessDescription}>
          {item.description}
        </ThemedText>
      </View>
    </Pressable>
  );
  
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
        {searchQuery ? (
          <Pressable 
            onPress={() => handleSearch('')}
            style={styles.clearButton}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
          </Pressable>
        ) : null}
      </View>
      
      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {/* "All" option */}
          <Pressable 
            style={[styles.categoryItem, selectedCategory === null && styles.selectedCategoryItem]}
            onPress={() => setSelectedCategory(null)}
          >
            <View style={[styles.allCategoryImage, selectedCategory === null && styles.selectedAllCategoryImage]}>
              <IconSymbol name="grid" size={24} color={selectedCategory === null ? "#fff" : "#000"} />
            </View>
            <ThemedText style={[styles.categoryTitle, selectedCategory === null && styles.selectedCategoryTitle]}>
              All
            </ThemedText>
          </Pressable>
          
          {categories.map((category) => (
            <Pressable 
              key={category.id}
              style={[styles.categoryItem, selectedCategory === category.id && styles.selectedCategoryItem]}
              onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <Image source={category.image} style={styles.categoryImage} contentFit="cover" />
              <ThemedText style={[styles.categoryTitle, selectedCategory === category.id && styles.selectedCategoryTitle]}>
                {category.title}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      {/* Businesses List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={businesses}
          renderItem={renderBusinessItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.businessesContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="magnifyingglass" size={40} color="#ccc" />
              <ThemedText style={styles.emptyText}>
                {searchQuery ? `No results found for "${searchQuery}"` : 'No businesses available'}
              </ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 16,
    marginBottom: 16,
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
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  selectedCategoryItem: {
    // Styling for selected category
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  allCategoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedAllCategoryImage: {
    backgroundColor: '#007bff',
  },
  categoryTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedCategoryTitle: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  businessesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  businessItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  businessImage: {
    width: 100,
    height: 100,
  },
  businessContent: {
    flex: 1,
    padding: 12,
  },
  businessTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  businessSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 14,
    color: '#666',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});
