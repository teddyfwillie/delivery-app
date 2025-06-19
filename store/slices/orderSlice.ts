import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Define types
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: Array<{ name: string; price?: number }>;
}

interface DeliveryAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  instructions?: string;
}

interface OrderData {
  items: OrderItem[];
  businessId: string;
  businessName: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: DeliveryAddress;
  deliveryInstructions?: string;
}

interface Order extends OrderData {
  id: string;
  status: 'placed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Mock API call to save an order
export const saveOrder = createAsyncThunk<Order, OrderData>(
  'orders/saveOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to save the order
      // For now, we'll simulate a successful API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a unique ID for the order
      const orderId = uuidv4();
      
      // Add order ID, status, and timestamp
      const newOrder = {
        ...orderData,
        id: orderId,
        status: 'placed' as const,
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
      };
      
      return newOrder;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Mock API call to fetch user orders
export const fetchUserOrders = createAsyncThunk<Order[], string>(
  'orders/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to fetch orders
      // For now, we'll simulate a successful API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock orders with different statuses to demonstrate tracking
      const mockOrders: Order[] = [
        {
          id: 'order-001',
          status: 'placed',
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
          items: [
            { id: 'item-1', name: 'Chicken Burger', price: 8.99, quantity: 2 },
            { id: 'item-2', name: 'French Fries', price: 3.99, quantity: 1 },
            { id: 'item-3', name: 'Soda', price: 1.99, quantity: 2 }
          ],
          businessId: 'business-001',
          businessName: 'Burger Palace',
          subtotal: 25.95,
          tax: 2.08,
          deliveryFee: 2.99,
          discount: 0,
          total: 31.02,
          paymentMethod: 'Credit Card',
          deliveryAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          }
        },
        {
          id: 'order-002',
          status: 'preparing',
          createdAt: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
          estimatedDeliveryTime: new Date(Date.now() + 20 * 60000).toISOString(), // 20 minutes from now
          items: [
            { id: 'item-1', name: 'Pepperoni Pizza', price: 12.99, quantity: 1 },
            { id: 'item-2', name: 'Garlic Bread', price: 4.99, quantity: 1 }
          ],
          businessId: 'business-002',
          businessName: 'Pizza Express',
          subtotal: 17.98,
          tax: 1.44,
          deliveryFee: 3.99,
          discount: 2.00,
          total: 21.41,
          paymentMethod: 'PayPal',
          deliveryAddress: {
            street: '456 Oak Ave',
            apartment: '2B',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          }
        },
        {
          id: 'order-003',
          status: 'out-for-delivery',
          createdAt: new Date(Date.now() - 90 * 60000).toISOString(), // 1.5 hours ago
          estimatedDeliveryTime: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes from now
          items: [
            { id: 'item-1', name: 'Pad Thai', price: 11.99, quantity: 1 },
            { id: 'item-2', name: 'Spring Rolls', price: 5.99, quantity: 2 }
          ],
          businessId: 'business-003',
          businessName: 'Thai Delight',
          subtotal: 23.97,
          tax: 1.92,
          deliveryFee: 4.99,
          discount: 0,
          total: 30.88,
          paymentMethod: 'Credit Card',
          deliveryAddress: {
            street: '789 Pine St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            instructions: 'Leave at door'
          }
        },
        {
          id: 'order-004',
          status: 'delivered',
          createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
          estimatedDeliveryTime: new Date(Date.now() - 23 * 60 * 60000).toISOString(), // Delivered 23 hours ago
          items: [
            { id: 'item-1', name: 'Sushi Combo', price: 18.99, quantity: 1 },
            { id: 'item-2', name: 'Miso Soup', price: 2.99, quantity: 2 }
          ],
          businessId: 'business-004',
          businessName: 'Sushi House',
          subtotal: 24.97,
          tax: 2.00,
          deliveryFee: 3.99,
          discount: 5.00,
          total: 25.96,
          paymentMethod: 'Credit Card',
          deliveryAddress: {
            street: '101 Maple Dr',
            apartment: '3C',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          }
        },
        {
          id: 'order-005',
          status: 'cancelled',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
          estimatedDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 45 * 60000).toISOString(), // Would have been 45 min after order
          items: [
            { id: 'item-1', name: 'Veggie Bowl', price: 10.99, quantity: 1 },
            { id: 'item-2', name: 'Smoothie', price: 5.99, quantity: 1 }
          ],
          businessId: 'business-005',
          businessName: 'Healthy Bites',
          subtotal: 16.98,
          tax: 1.36,
          deliveryFee: 2.99,
          discount: 0,
          total: 21.33,
          paymentMethod: 'Credit Card',
          deliveryAddress: {
            street: '202 Cedar Ln',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          }
        }
      ];
      
      return mockOrders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the order slice
export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle saveOrder
      .addCase(saveOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, setOrderStatus } = orderSlice.actions;

export default orderSlice.reducer;
