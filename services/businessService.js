import BaseAPI from './api';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  startAfter,
  GeoPoint,
  getDoc,
  doc
} from 'firebase/firestore';

class BusinessService extends BaseAPI {
  constructor() {
    super('businesses');
  }

  // Get businesses by category
  async getBusinessesByCategory(category, lastDoc = null, pageSize = 10) {
    try {
      let q;
      
      if (lastDoc) {
        q = query(
          this.collectionRef,
          where('categories', 'array-contains', category),
          orderBy('rating', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      } else {
        q = query(
          this.collectionRef,
          where('categories', 'array-contains', category),
          orderBy('rating', 'desc'),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return {
        data,
        lastDoc: lastVisible,
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting businesses by category:', error);
      throw error;
    }
  }

  // Get nearby businesses
  async getNearbyBusinesses(latitude, longitude, radiusInKm = 5, lastDoc = null, pageSize = 10) {
    try {
      // This is a simplified approach. In a production app, you would use
      // Firestore's geoqueries or a cloud function for more efficient geo-queries
      const allBusinesses = await this.getAll();
      
      // Calculate distance for each business
      const businessesWithDistance = allBusinesses.map(business => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          business.location?.latitude || 0,
          business.location?.longitude || 0
        );
        
        return {
          ...business,
          distance
        };
      });
      
      // Filter by radius and sort by distance
      const nearbyBusinesses = businessesWithDistance
        .filter(business => business.distance <= radiusInKm)
        .sort((a, b) => a.distance - b.distance);
      
      // Handle pagination manually
      const startIndex = lastDoc ? parseInt(lastDoc) : 0;
      const endIndex = startIndex + pageSize;
      const paginatedBusinesses = nearbyBusinesses.slice(startIndex, endIndex);
      
      return {
        data: paginatedBusinesses,
        lastDoc: endIndex.toString(),
        hasMore: endIndex < nearbyBusinesses.length
      };
    } catch (error) {
      console.error('Error getting nearby businesses:', error);
      throw error;
    }
  }

  // Search businesses by name
  async searchBusinesses(searchTerm, lastDoc = null, pageSize = 10) {
    try {
      // Firestore doesn't support direct text search, so we'll get all businesses
      // and filter them manually. In a production app, you would use
      // a service like Algolia or Elasticsearch for better search functionality.
      const allBusinesses = await this.getAll();
      
      // Filter by search term (case-insensitive)
      const searchTermLower = searchTerm.toLowerCase();
      const filteredBusinesses = allBusinesses.filter(business => 
        business.name.toLowerCase().includes(searchTermLower) ||
        business.description?.toLowerCase().includes(searchTermLower) ||
        (business.tags && business.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
      );
      
      // Handle pagination manually
      const startIndex = lastDoc ? parseInt(lastDoc) : 0;
      const endIndex = startIndex + pageSize;
      const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);
      
      return {
        data: paginatedBusinesses,
        lastDoc: endIndex.toString(),
        hasMore: endIndex < filteredBusinesses.length
      };
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }

  // Get business products
  async getBusinessProducts(businessId) {
    try {
      const productsCollection = new BaseAPI('products');
      return await productsCollection.queryByField('businessId', businessId);
    } catch (error) {
      console.error('Error getting business products:', error);
      throw error;
    }
  }

  // Get business reviews
  async getBusinessReviews(businessId, lastDoc = null, pageSize = 10) {
    try {
      const reviewsCollection = new BaseAPI('reviews');
      let q;
      
      if (lastDoc) {
        q = query(
          collection(db, 'reviews'),
          where('businessId', '==', businessId),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, 'reviews'),
          where('businessId', '==', businessId),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return {
        data,
        lastDoc: lastVisible,
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error getting business reviews:', error);
      throw error;
    }
  }

  // Get business categories
  async getCategories() {
    try {
      const categoriesCollection = new BaseAPI('categories');
      return await categoriesCollection.getAll();
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  // Helper method to calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

export default new BusinessService();
