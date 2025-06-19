import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import mockDataService from '@/services/mockDataService';

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

interface Category {
  id: string;
  title: string;
  image: any;
}

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get all categories to find the one with matching ID
        const categories = await mockDataService.getCategories();
        const foundCategory = categories.find(cat => cat.id === id);
        setCategory(foundCategory || null);
        
        if (foundCategory) {
          // Get businesses for this category
          const categoryBusinesses = await mockDataService.getBusinessesByCategory(id as string);
          setBusinesses(categoryBusinesses);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <Pressable 
      style={styles.businessItem}
      onPress={() => {
        // Use simple string navigation with type assertion
        router.push(`/business/${item.id}` as any)
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
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          {category ? category.title : 'Category'}
        </ThemedText>
      </View>

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
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No businesses found in this category.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
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
  listContainer: {
    padding: 16,
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
