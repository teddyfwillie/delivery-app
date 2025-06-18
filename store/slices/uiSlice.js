import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light' or 'dark'
  isLoading: false,
  globalError: null,
  toasts: [],
  modals: {
    addressSelector: false,
    filterOptions: false,
    sortOptions: false,
    paymentMethods: false,
    confirmationDialog: {
      isOpen: false,
      title: '',
      message: '',
      confirmAction: null,
      cancelAction: null,
    },
  },
  bottomSheets: {
    itemDetails: {
      isOpen: false,
      itemId: null,
    },
    orderTracking: {
      isOpen: false,
      orderId: null,
    },
    ratingReview: {
      isOpen: false,
      businessId: null,
      orderId: null,
    },
  },
  refreshing: {
    home: false,
    orders: false,
    account: false,
    browse: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
    addToast: (state, action) => {
      // Generate unique ID for the toast
      const id = Date.now().toString();
      state.toasts.push({
        id,
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    setModalState: (state, action) => {
      const { modal, isOpen, data } = action.payload;
      
      if (modal === 'confirmationDialog') {
        state.modals.confirmationDialog = {
          isOpen,
          ...(data || {}),
        };
      } else if (state.modals.hasOwnProperty(modal)) {
        state.modals[modal] = isOpen;
      }
    },
    setBottomSheetState: (state, action) => {
      const { sheet, isOpen, data } = action.payload;
      
      if (state.bottomSheets.hasOwnProperty(sheet)) {
        state.bottomSheets[sheet] = {
          isOpen,
          ...(data || {}),
        };
      }
    },
    setRefreshing: (state, action) => {
      const { screen, isRefreshing } = action.payload;
      if (state.refreshing.hasOwnProperty(screen)) {
        state.refreshing[screen] = isRefreshing;
      }
    },
  },
});

export const {
  setTheme,
  setIsLoading,
  setGlobalError,
  clearGlobalError,
  addToast,
  removeToast,
  clearAllToasts,
  setModalState,
  setBottomSheetState,
  setRefreshing,
} = uiSlice.actions;

export default uiSlice.reducer;
