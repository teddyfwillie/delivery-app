import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

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

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const initialQuery = params.query as string || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const searchResults = await mockDataService.searchBusinesses(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <Pressable 
      style={styles.businessItem}
      onPress={() => {
        // Use simple string navigation with type assertion
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
      {/* Header with back button and search */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </Pressable>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#999" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for stores or items"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus={!initialQuery}
          />
          {searchQuery ? (
            <Pressable 
              onPress={() => {
                setSearchQuery('');
                setResults([]);
                setSearched(false);
              }}
              style={styles.clearButton}
            >
              <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText style={styles.loadingText}>Searching...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderBusinessItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyContainer}>
                <IconSymbol name="magnifyingglass" size={40} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                  No results found for "{searchQuery}"
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Try a different search term or browse categories
                </ThemedText>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <IconSymbol name="magnifyingglass" size={40} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                  Search for restaurants, food, or cuisines
                </ThemedText>
              </View>
            )
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
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
