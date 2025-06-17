import { Image } from 'expo-image';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

// Sample data for featured and popular sections
const featuredItems = [
  { id: '1', title: 'Sushi', image: require('@/assets/images/placeholder.png') },
  { id: '2', title: 'Pizza', image: require('@/assets/images/placeholder.png') },
  { id: '3', title: 'Burgers', image: require('@/assets/images/placeholder.png') },
  { id: '4', title: 'Desserts', image: require('@/assets/images/placeholder.png') },
];

const popularItems = [
  { 
    id: '1', 
    title: 'The Burger Joint', 
    category: 'Burgers', 
    time: '45-60 min',
    image: require('@/assets/images/placeholder.png') 
  },
  { 
    id: '2', 
    title: 'Fresh Foods Market', 
    category: 'Groceries', 
    time: '30-45 min',
    image: require('@/assets/images/placeholder.png') 
  },
  { 
    id: '3', 
    title: 'The Coffee Corner', 
    category: 'Coffee', 
    time: '15-30 min',
    image: require('@/assets/images/placeholder.png') 
  },
  { 
    id: '4', 
    title: 'The Italian Place', 
    category: 'Italian', 
    time: '60-75 min',
    image: require('@/assets/images/placeholder.png') 
  },
  { 
    id: '5', 
    title: 'The Mexican Cantina', 
    category: 'Mexican', 
    time: '45-60 min',
    image: require('@/assets/images/placeholder.png') 
  },
  { 
    id: '6', 
    title: 'The Bakery', 
    category: 'Bakery', 
    time: '30-45 min',
    image: require('@/assets/images/placeholder.png') 
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
});

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [deliveryType, setDeliveryType] = useState('Delivery');

  const renderFeaturedItem = ({ item }: { item: any }) => (
    <Pressable style={styles.featuredItem}>
      <Image source={item.image} style={styles.featuredImage} contentFit="cover" />
      <ThemedText style={styles.featuredTitle}>{item.title}</ThemedText>
    </Pressable>
  );

  const renderPopularItem = ({ item }: { item: any }) => (
    <Pressable style={styles.popularItem}>
      <Image source={item.image} style={styles.popularImage} contentFit="cover" />
      <ThemedText style={styles.popularTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.popularSubtitle}>{item.category} · {item.time}</ThemedText>
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
        />
      </View>
      
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
          <ThemedText style={styles.sectionTitle}>Featured</ThemedText>
          <FlatList
            data={featuredItems}
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
            {popularItems.map((item) => (
              <View key={item.id} style={styles.popularItemContainer}>
                {renderPopularItem({ item })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

