import { Platform } from 'react-native';
import * as Location from 'expo-location';

// Mock data for categories
const categories = [
  { id: '1', title: 'Sushi', image: require('@/assets/images/placeholder.png') },
  { id: '2', title: 'Pizza', image: require('@/assets/images/placeholder.png') },
  { id: '3', title: 'Burgers', image: require('@/assets/images/placeholder.png') },
  { id: '4', title: 'Desserts', image: require('@/assets/images/placeholder.png') },
  { id: '5', title: 'Coffee', image: require('@/assets/images/placeholder.png') },
  { id: '6', title: 'Groceries', image: require('@/assets/images/placeholder.png') },
  { id: '7', title: 'Mexican', image: require('@/assets/images/placeholder.png') },
  { id: '8', title: 'Italian', image: require('@/assets/images/placeholder.png') },
  { id: '9', title: 'Chinese', image: require('@/assets/images/placeholder.png') },
  { id: '10', title: 'Bakery', image: require('@/assets/images/placeholder.png') },
];

// Mock data for businesses
const businesses = [
  { 
    id: '1', 
    title: 'The Burger Joint', 
    category: 'Burgers', 
    categoryId: '3', // Added categoryId matching with categories array
    time: '45-60 min',
    rating: 4.7,
    reviews: 234,
    priceLevel: '$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Gourmet burgers made with premium ingredients',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    }
  },
  { 
    id: '2', 
    title: 'Fresh Foods Market', 
    category: 'Groceries', 
    categoryId: '6', // Added categoryId matching with categories array
    time: '30-45 min',
    rating: 4.5,
    reviews: 187,
    priceLevel: '$$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Fresh produce and organic groceries delivered to your door',
    location: {
      latitude: 37.7739,
      longitude: -122.4312,
    }
  },
  { 
    id: '3', 
    title: 'The Coffee Corner', 
    category: 'Coffee', 
    categoryId: '5', // Added categoryId matching with categories array
    time: '15-30 min',
    rating: 4.8,
    reviews: 345,
    priceLevel: '$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Artisanal coffee and fresh pastries',
    location: {
      latitude: 37.7831,
      longitude: -122.4181,
    }
  },
  { 
    id: '4', 
    title: 'The Italian Place', 
    category: 'Italian', 
    categoryId: '8', // Added categoryId matching with categories array
    time: '60-75 min',
    rating: 4.6,
    reviews: 289,
    priceLevel: '$$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Authentic Italian cuisine with homemade pasta',
    location: {
      latitude: 37.7854,
      longitude: -122.4294,
    }
  },
  { 
    id: '5', 
    title: 'The Mexican Cantina', 
    category: 'Mexican', 
    categoryId: '7', // Added categoryId matching with categories array
    time: '45-60 min',
    rating: 4.4,
    reviews: 156,
    priceLevel: '$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Traditional Mexican dishes with a modern twist',
    location: {
      latitude: 37.7771,
      longitude: -122.4217,
    }
  },
  { 
    id: '6', 
    title: 'The Bakery', 
    category: 'Bakery', 
    categoryId: '10', // Added categoryId matching with categories array
    time: '30-45 min',
    rating: 4.9,
    reviews: 421,
    priceLevel: '$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Freshly baked bread, pastries, and cakes',
    location: {
      latitude: 37.7812,
      longitude: -122.4090,
    }
  },
  { 
    id: '7', 
    title: 'Sushi Express', 
    category: 'Sushi', 
    categoryId: '1', // Added categoryId matching with categories array
    time: '45-60 min',
    rating: 4.5,
    reviews: 198,
    priceLevel: '$$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Fresh sushi and Japanese specialties',
    location: {
      latitude: 37.7835,
      longitude: -122.4256,
    }
  },
  { 
    id: '8', 
    title: 'Pizza Palace', 
    category: 'Pizza', 
    categoryId: '2', // Added categoryId matching with categories array
    time: '30-45 min',
    rating: 4.3,
    reviews: 267,
    priceLevel: '$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Artisanal pizzas with a variety of toppings',
    location: {
      latitude: 37.7795,
      longitude: -122.4201,
    }
  },
  { 
    id: '9', 
    title: 'Sweet Treats', 
    category: 'Desserts', 
    categoryId: '4', // Added categoryId matching with categories array
    time: '20-35 min',
    rating: 4.7,
    reviews: 312,
    priceLevel: '$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Delicious desserts and sweet treats',
    location: {
      latitude: 37.7863,
      longitude: -122.4015,
    }
  },
  { 
    id: '10', 
    title: 'China Town', 
    category: 'Chinese', 
    categoryId: '9', // Added categoryId matching with categories array
    time: '40-55 min',
    rating: 4.2,
    reviews: 178,
    priceLevel: '$$',
    image: require('@/assets/images/placeholder.png'),
    description: 'Authentic Chinese cuisine with a modern twist',
    location: {
      latitude: 37.7823,
      longitude: -122.4167,
    }
  },
];

// Mock products for businesses
const products = {
  '1': [ // The Burger Joint
    {
      id: '101',
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, onion, and special sauce',
      price: 8.99,
      image: require('@/assets/images/placeholder.png'),
      options: [
        {
          id: 'cheese',
          name: 'Cheese',
          choices: [
            { id: 'american', name: 'American', price: 1.00 },
            { id: 'cheddar', name: 'Cheddar', price: 1.00 },
            { id: 'swiss', name: 'Swiss', price: 1.50 },
          ]
        },
        {
          id: 'extras',
          name: 'Extras',
          choices: [
            { id: 'bacon', name: 'Bacon', price: 2.00 },
            { id: 'avocado', name: 'Avocado', price: 1.50 },
            { id: 'egg', name: 'Fried Egg', price: 1.00 },
          ]
        }
      ]
    },
    {
      id: '102',
      name: 'Veggie Burger',
      description: 'Plant-based patty with lettuce, tomato, onion, and vegan mayo',
      price: 9.99,
      image: require('@/assets/images/placeholder.png'),
      options: [
        {
          id: 'cheese',
          name: 'Cheese',
          choices: [
            { id: 'vegan', name: 'Vegan Cheese', price: 1.50 },
            { id: 'none', name: 'No Cheese', price: 0 },
          ]
        }
      ]
    },
    {
      id: '103',
      name: 'French Fries',
      description: 'Crispy golden fries with sea salt',
      price: 3.99,
      image: require('@/assets/images/placeholder.png'),
      options: [
        {
          id: 'size',
          name: 'Size',
          choices: [
            { id: 'small', name: 'Small', price: 0 },
            { id: 'large', name: 'Large', price: 2.00 },
          ]
        }
      ]
    }
  ],
  // Add more products for other businesses as needed
};

class MockDataService {
  // Get all categories
  getCategories() {
    return Promise.resolve(categories);
  }

  // Get featured categories (subset of all categories)
  getFeaturedCategories() {
    return Promise.resolve(categories.slice(0, 5));
  }

  // Get all businesses
  getAllBusinesses() {
    return Promise.resolve(businesses);
  }

  // Get popular businesses (sorted by rating)
  getPopularBusinesses() {
    return Promise.resolve([...businesses].sort((a, b) => b.rating - a.rating).slice(0, 6));
  }

  // Get businesses by category
  getBusinessesByCategory(categoryId) {
    if (!categoryId) return Promise.resolve(businesses);
    
    return Promise.resolve(
      businesses.filter(business => business.categoryId === categoryId)
    );
  }

  // Get business by ID
  getBusinessById(id) {
    const business = businesses.find(b => b.id === id);
    return Promise.resolve(business || null);
  }

  // Get products for a business
  getBusinessProducts(businessId) {
    return Promise.resolve(products[businessId] || []);
  }

  // Get nearby businesses (simulated)
  async getNearbyBusinesses() {
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // If permission not granted, return popular businesses instead
        return this.getPopularBusinesses();
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Calculate distance for each business (simplified)
      const businessesWithDistance = businesses.map(business => {
        // Simple distance calculation (not accurate, just for demo)
        const latDiff = Math.abs(business.location.latitude - latitude);
        const lonDiff = Math.abs(business.location.longitude - longitude);
        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Rough km conversion
        
        return {
          ...business,
          distance
        };
      });

      // Sort by distance
      const sortedBusinesses = businessesWithDistance.sort((a, b) => a.distance - b.distance);
      
      return Promise.resolve(sortedBusinesses);
    } catch (error) {
      console.error('Error getting nearby businesses:', error);
      // Fallback to popular businesses
      return this.getPopularBusinesses();
    }
  }

  // Search businesses
  searchBusinesses(query) {
    if (!query) return Promise.resolve([]);
    
    const normalizedQuery = query.toLowerCase();
    const results = businesses.filter(business => 
      business.title.toLowerCase().includes(normalizedQuery) ||
      business.category.toLowerCase().includes(normalizedQuery) ||
      business.description.toLowerCase().includes(normalizedQuery)
    );
    
    return Promise.resolve(results);
  }
}

export default new MockDataService();
