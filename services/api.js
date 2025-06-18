import { auth, db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  GeoPoint,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Base API class with common methods
class BaseAPI {
  constructor(collectionName) {
    this.collectionRef = collection(db, collectionName);
  }

  // Get a document by ID
  async getById(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document: ${error}`);
      throw error;
    }
  }

  // Get all documents in a collection
  async getAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting documents: ${error}`);
      throw error;
    }
  }

  // Get documents with pagination
  async getPaginated(lastDoc = null, pageSize = 10) {
    try {
      let q;
      
      if (lastDoc) {
        q = query(
          this.collectionRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      } else {
        q = query(
          this.collectionRef,
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
      console.error(`Error getting paginated documents: ${error}`);
      throw error;
    }
  }

  // Create a new document
  async create(data) {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document: ${error}`);
      throw error;
    }
  }

  // Update a document
  async update(id, data) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error(`Error updating document: ${error}`);
      throw error;
    }
  }

  // Delete a document
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      await deleteDoc(docRef);
      
      return true;
    } catch (error) {
      console.error(`Error deleting document: ${error}`);
      throw error;
    }
  }

  // Query documents by field
  async queryByField(field, value) {
    try {
      const q = query(this.collectionRef, where(field, '==', value));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying documents: ${error}`);
      throw error;
    }
  }
}

// Export the BaseAPI class
export default BaseAPI;
