import BaseAPI from './api';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

class UserService extends BaseAPI {
  constructor() {
    super('users');
  }

  // Get current user profile
  async getCurrentUserProfile() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      return await this.getById(currentUser.uid);
    } catch (error) {
      console.error('Error getting current user profile:', error);
      throw error;
    }
  }

  // Update current user profile
  async updateCurrentUserProfile(profileData) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Update display name in Auth if provided
      if (profileData.fullName) {
        await updateProfile(currentUser, {
          displayName: profileData.fullName,
        });
      }

      // Update profile in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user addresses
  async getUserAddresses() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      return await this.queryByField('userId', currentUser.uid);
    } catch (error) {
      console.error('Error getting user addresses:', error);
      throw error;
    }
  }

  // Add user address
  async addAddress(addressData) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const addressesCollection = new BaseAPI('addresses');
      const addressId = await addressesCollection.create({
        ...addressData,
        userId: currentUser.uid,
      });

      return addressId;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  // Update user address
  async updateAddress(addressId, addressData) {
    try {
      const addressesCollection = new BaseAPI('addresses');
      return await addressesCollection.update(addressId, addressData);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete user address
  async deleteAddress(addressId) {
    try {
      const addressesCollection = new BaseAPI('addresses');
      return await addressesCollection.delete(addressId);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Get user payment methods
  async getPaymentMethods() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const paymentsCollection = new BaseAPI('paymentMethods');
      return await paymentsCollection.queryByField('userId', currentUser.uid);
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Add payment method
  async addPaymentMethod(paymentData) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const paymentsCollection = new BaseAPI('paymentMethods');
      const paymentId = await paymentsCollection.create({
        ...paymentData,
        userId: currentUser.uid,
      });

      return paymentId;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  // Delete payment method
  async deletePaymentMethod(paymentId) {
    try {
      const paymentsCollection = new BaseAPI('paymentMethods');
      return await paymentsCollection.delete(paymentId);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await updateDoc(userRef, {
          preferences: {
            ...(userData.preferences || {}),
            ...preferences,
          },
          updatedAt: new Date().toISOString(),
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export default new UserService();
