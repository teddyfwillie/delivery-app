import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Async thunks
export const fetchUserAddresses = createAsyncThunk(
  'user/fetchUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const querySnapshot = await getDocs(addressesRef);
      
      const addresses = [];
      querySnapshot.forEach(doc => {
        addresses.push({ id: doc.id, ...doc.data() });
      });
      
      return addresses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const docRef = await addDoc(addressesRef, addressData);
      
      return { id: docRef.id, ...addressData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const { id, ...data } = addressData;
      const addressRef = doc(db, 'users', userId, 'addresses', id);
      await updateDoc(addressRef, data);
      
      return addressData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const addressRef = doc(db, 'users', userId, 'addresses', addressId);
      await deleteDoc(addressRef);
      
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async (addressId, { rejectWithValue, getState }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { defaultAddressId: addressId });
      
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userProfile: null,
  addresses: [],
  paymentMethods: [],
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'en',
  },
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    // Regular reducers (not async)
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    addPaymentMethod: (state, action) => {
      state.paymentMethods.push(action.payload);
    },
    removePaymentMethod: (state, action) => {
      state.paymentMethods = state.paymentMethods.filter(
        method => method.id !== action.payload
      );
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUserAddresses
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch addresses';
      })
    
    // addAddress
    builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add address';
      })
    
    // updateAddress
    builder
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update address';
      })
    
    // deleteAddress
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete address';
      })
    
    // setDefaultAddress
    builder
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.defaultAddressId = action.payload;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to set default address';
      });
  },
});

export const {
  setUserProfile,
  setAddresses,
  removeAddress,
  setPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  updatePreferences,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
