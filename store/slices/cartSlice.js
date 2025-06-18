import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  businessId: null,
  businessName: '',
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  couponCode: null,
  discount: 0,
  deliveryAddress: null,
  deliveryInstructions: '',
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      // Check if item is from the same business
      if (state.items.length > 0 && state.businessId !== action.payload.businessId) {
        // Replace cart with new business
        state.items = [action.payload];
        state.businessId = action.payload.businessId;
        state.businessName = action.payload.businessName;
      } else if (state.items.length === 0) {
        // First item in cart
        state.items = [action.payload];
        state.businessId = action.payload.businessId;
        state.businessName = action.payload.businessName;
      } else {
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          item => item.id === action.payload.id
        );
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          state.items[existingItemIndex].quantity += action.payload.quantity;
        } else {
          // Add new item
          state.items.push(action.payload);
        }
      }
      
      // Recalculate totals
      calculateTotals(state);
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }
        
        // Recalculate totals
        calculateTotals(state);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // If cart is empty, reset business info
      if (state.items.length === 0) {
        state.businessId = null;
        state.businessName = '';
      }
      
      // Recalculate totals
      calculateTotals(state);
    },
    clearCart: (state) => {
      return initialState;
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
      
      // Recalculate totals
      calculateTotals(state);
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
      
      // Recalculate totals
      calculateTotals(state);
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },
    setDeliveryInstructions: (state, action) => {
      state.deliveryInstructions = action.payload;
    },
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
      
      // Recalculate totals
      calculateTotals(state);
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
});

// Helper function to calculate totals
const calculateTotals = (state) => {
  // Calculate subtotal
  state.subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  // Calculate tax (assuming 8% tax rate)
  state.tax = state.subtotal * 0.08;
  
  // Calculate total
  state.total = state.subtotal + state.tax + state.deliveryFee - state.discount;
};

export const {
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  setDeliveryAddress,
  setDeliveryInstructions,
  setDeliveryFee,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
