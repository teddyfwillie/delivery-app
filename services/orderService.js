import BaseAPI from './api';
import { auth, db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  startAfter,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

class OrderService extends BaseAPI {
  constructor() {
    super('orders');
  }

  // Get user orders
  async getUserOrders(status = null, lastDoc = null, pageSize = 10) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      let q;
      
      if (status) {
        if (lastDoc) {
          q = query(
            this.collectionRef,
            where('userId', '==', currentUser.uid),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            this.collectionRef,
            where('userId', '==', currentUser.uid),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
      } else {
        if (lastDoc) {
          q = query(
            this.collectionRef,
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            this.collectionRef,
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
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
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  // Get business orders (for business owners)
  async getBusinessOrders(businessId, status = null, lastDoc = null, pageSize = 10) {
    try {
      let q;
      
      if (status) {
        if (lastDoc) {
          q = query(
            this.collectionRef,
            where('businessId', '==', businessId),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            this.collectionRef,
            where('businessId', '==', businessId),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
      } else {
        if (lastDoc) {
          q = query(
            this.collectionRef,
            where('businessId', '==', businessId),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            this.collectionRef,
            where('businessId', '==', businessId),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
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
      console.error('Error getting business orders:', error);
      throw error;
    }
  }

  // Get driver orders (for delivery drivers)
  async getDriverOrders(driverId, status = null, lastDoc = null, pageSize = 10) {
    try {
      let q;
      
      if (status) {
        if (lastDoc) {
          q = query(
            this.collectionRef,
            where('driverId', '==', driverId),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            this.collectionRef,
            where('driverId', '==', driverId),
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
      } else {
        if (lastDoc) {
          q = query(
            this.collectionRef,
            where('driverId', '==', driverId),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            this.collectionRef,
            where('driverId', '==', driverId),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
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
      console.error('Error getting driver orders:', error);
      throw error;
    }
  }

  // Create a new order
  async createOrder(orderData) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const orderWithUser = {
        ...orderData,
        userId: currentUser.uid,
        userName: currentUser.displayName || '',
        userEmail: currentUser.email || '',
        status: 'pending', // Initial status
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
          }
        ],
        createdAt: serverTimestamp(),
      };

      const orderId = await this.create(orderWithUser);
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderDoc.data();
      const statusHistory = orderData.statusHistory || [];
      
      // Add new status to history
      statusHistory.push({
        status,
        notes,
        timestamp: new Date().toISOString(),
      });
      
      await updateDoc(orderRef, {
        status,
        statusHistory,
        updatedAt: serverTimestamp(),
      });
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Assign driver to order
  async assignDriver(orderId, driverId, driverName) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        driverId,
        driverName,
        status: 'assigned',
        statusHistory: [
          {
            status: 'assigned',
            timestamp: new Date().toISOString(),
            notes: `Assigned to driver: ${driverName}`,
          }
        ],
        updatedAt: serverTimestamp(),
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  }

  // Add order review
  async addOrderReview(orderId, reviewData) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderDoc.data();
      
      // Create review document
      const reviewsCollection = new BaseAPI('reviews');
      const reviewId = await reviewsCollection.create({
        ...reviewData,
        orderId,
        userId: currentUser.uid,
        userName: currentUser.displayName || '',
        businessId: orderData.businessId,
        businessName: orderData.businessName,
      });
      
      // Update order with review reference
      await updateDoc(orderRef, {
        reviewId,
        hasReview: true,
        updatedAt: serverTimestamp(),
      });
      
      return reviewId;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
}

export default new OrderService();
