import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import mockDataService from '@/services/mockDataService';
import { addItem } from '@/store/slices/cartSlice';

// Define types for our data
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
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  options?: {
    id: string;
    name: string;
    choices: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
}

export default function BusinessScreen() {
  const { id } = useLocalSearchParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  
  // Get cart item count from Redux store
  const cartItemCount = useSelector((state: any) => state.cart.items.reduce((total: number, item: any) => total + item.quantity, 0));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get business details
        const businessData = await mockDataService.getBusinessById(id as string);
        setBusiness(businessData);
        
        // Get business products
        const businessProducts = await mockDataService.getBusinessProducts(id as string);
        setAllProducts(businessProducts || []);
        setFilteredProducts(businessProducts || []);
      } catch (error) {
        console.error('Error loading business data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  // Filter products when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(allProducts);
      return;
    }
    
    const normalizedQuery = searchQuery.toLowerCase();
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  const handleAddToCart = (product: Product) => {
    if (!business) return;
    
    // Add item to cart
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      businessId: business.id,
      businessName: business.title
    }));
    
    // Show success message
    Alert.alert(
      'Added to Cart',
      `${product.name} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };
  
  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Pressable 
      style={styles.productItem}
      onPress={() => handleViewProductDetails(item)}
    >
      <View style={styles.productContent}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        <ThemedText style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
        <ThemedText style={styles.productPrice}>${item.price.toFixed(2)}</ThemedText>
        {item.options && item.options.length > 0 && (
          <ThemedText style={styles.customizableText}>Customizable</ThemedText>
        )}
      </View>
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} contentFit="cover" />
        <Pressable 
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onPress
            handleAddToCart(item);
          }}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
  
  // View product details (options, etc.)
  const handleViewProductDetails = (product: Product) => {
    if (product.options && product.options.length > 0) {
      // In a real app, this would navigate to a product detail modal/screen
      Alert.alert(
        product.name,
        `${product.description}\n\nCustomization options available. In a complete app, this would open a detailed view.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : business ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with back button */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </Pressable>
          </View>
          
          {/* Cart button */}
          <Pressable 
            style={{
              position: 'absolute',
              top: 50,
              right: 16,
              zIndex: 10,
              padding: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 20,
            }} 
            onPress={() => router.push('/cart' as any)}
          >
            <View style={{ position: 'relative' }}>
              <IconSymbol name="cart" size={24} color="#000" />
              {cartItemCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: '#FF5A5F',
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <ThemedText style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>{cartItemCount}</ThemedText>
                </View>
              )}
            </View>
          </Pressable>
          
          {/* Business Image */}
          <Image source={business.image} style={styles.businessImage} contentFit="cover" />
          
          {/* Business Info */}
          <View style={styles.businessInfo}>
            <ThemedText style={styles.businessTitle}>{business.title}</ThemedText>
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={16} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{business.rating}</ThemedText>
              <ThemedText style={styles.reviewCount}>({business.reviews} reviews)</ThemedText>
            </View>
            <ThemedText style={styles.businessCategory}>
              {business.category} • {business.priceLevel} • {business.time}
            </ThemedText>
            <ThemedText style={styles.businessDescription}>
              {business.description}
            </ThemedText>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search menu items..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch} style={styles.clearButton}>
                <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
              </Pressable>
            )}
          </View>
          
          {/* Menu Section */}
          <View style={styles.menuSection}>
            <ThemedText style={styles.menuTitle}>Menu</ThemedText>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <View key={product.id}>
                  {renderProductItem({ item: product })}
                </View>
              ))
            ) : (
              <ThemedText style={styles.emptyText}>
                {searchQuery ? `No results found for "${searchQuery}"` : 'No menu items available.'}
              </ThemedText>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Business not found</ThemedText>
          <Pressable 
            style={styles.backHomeButton}
            onPress={() => router.push('/')}
          >
            <ThemedText style={styles.backHomeText}>Back to Home</ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backHomeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  backHomeText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  backButton: {
    padding: 8,
  },
  businessImage: {
    width: '100%',
    height: 200,
  },
  businessInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  businessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  menuSection: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 16,
    marginTop: 16,
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
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productContent: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customizableText: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
