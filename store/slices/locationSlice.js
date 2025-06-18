import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  selectedLocation: null,
  recentLocations: [],
  searchHistory: [],
  permissionStatus: null,
  loading: false,
  error: null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      // Add to recent locations if not already there
      if (action.payload) {
        const exists = state.recentLocations.some(
          loc => loc.latitude === action.payload.latitude && 
                loc.longitude === action.payload.longitude
        );
        if (!exists) {
          // Keep only the last 5 locations
          if (state.recentLocations.length >= 5) {
            state.recentLocations.pop();
          }
          state.recentLocations.unshift(action.payload);
        }
      }
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    addRecentLocation: (state, action) => {
      // Check if location already exists
      const exists = state.recentLocations.some(
        loc => loc.latitude === action.payload.latitude && 
              loc.longitude === action.payload.longitude
      );
      
      if (!exists) {
        // Keep only the last 5 locations
        if (state.recentLocations.length >= 5) {
          state.recentLocations.pop();
        }
        state.recentLocations.unshift(action.payload);
      }
    },
    clearRecentLocations: (state) => {
      state.recentLocations = [];
    },
    addSearchHistoryItem: (state, action) => {
      // Check if search already exists
      const exists = state.searchHistory.some(item => item.query === action.payload.query);
      
      if (!exists) {
        // Keep only the last 10 searches
        if (state.searchHistory.length >= 10) {
          state.searchHistory.pop();
        }
        state.searchHistory.unshift(action.payload);
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    setPermissionStatus: (state, action) => {
      state.permissionStatus = action.payload;
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

export const {
  setCurrentLocation,
  setSelectedLocation,
  addRecentLocation,
  clearRecentLocations,
  addSearchHistoryItem,
  clearSearchHistory,
  setPermissionStatus,
  setLoading,
  setError,
  clearError,
} = locationSlice.actions;

export default locationSlice.reducer;
