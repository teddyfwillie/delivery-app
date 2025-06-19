import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { fetchUserOrders, setOrderStatus } from '@/store/slices/orderSlice';
import { store } from '@/store';

// Define AppDispatch type
type AppDispatch = typeof store.dispatch;

export default function OrdersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: any) => state.orders);
  
  useEffect(() => {
    // Fetch orders when component mounts
    dispatch(fetchUserOrders('current-user-id') as any);
  }, [dispatch]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <ThemedText style={styles.orderNumber}>Order #{item.id.substring(0, 8)}</ThemedText>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <ThemedText style={styles.statusText}>{getStatusText(item.status)}</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.businessName}>{item.businessName}</ThemedText>
      <ThemedText style={styles.date}>Placed on {formatDate(item.createdAt)}</ThemedText>
      
      <View style={styles.itemsList}>
        {item.items.map((orderItem: any) => (
          <View key={orderItem.id} style={styles.orderItem}>
            <ThemedText style={styles.itemQuantity}>{orderItem.quantity}x</ThemedText>
            <ThemedText style={styles.itemName}>{orderItem.name}</ThemedText>
            <ThemedText style={styles.itemPrice}>${orderItem.price.toFixed(2)}</ThemedText>
          </View>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <ThemedText style={styles.totalLabel}>Total</ThemedText>
        <ThemedText style={styles.totalPrice}>${item.total.toFixed(2)}</ThemedText>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="arrow.clockwise" size={16} color="#333" />
          <ThemedText style={styles.actionText}>Reorder</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="doc.text" size={16} color="#333" />
          <ThemedText style={styles.actionText}>Details</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  // Get appropriate style and display text for order status
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'placed': return styles.statusPlaced;
      case 'preparing': return styles.statusPreparing;
      case 'out-for-delivery': return styles.statusOutForDelivery;
      case 'delivered': return styles.statusDelivered;
      case 'cancelled': return styles.statusCancelled;
      default: return {};
    }
  };
  
  // Get user-friendly status text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'placed': return 'Pending';
      case 'preparing': return 'Preparing';
      case 'out-for-delivery': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.screenTitle}>Your Orders</ThemedText>
      
      {/* Order Tracking Demo Controls */}
      <View style={styles.trackingDemo}>
        <ThemedText style={styles.trackingTitle}>Order Tracking Demo</ThemedText>
        <ThemedText style={styles.trackingSubtitle}>Select an order and update its status</ThemedText>
        
        <View style={styles.trackingControls}>
          <TouchableOpacity 
            style={[styles.demoButton, styles.demoButtonPending]}
            onPress={() => {
              if (orders.length > 0) {
                dispatch(setOrderStatus({ orderId: orders[0].id, status: 'placed' }) as any);
              }
            }}
          >
            <ThemedText style={styles.demoButtonText}>Set Pending</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.demoButton, styles.demoButtonPreparing]}
            onPress={() => {
              if (orders.length > 0) {
                dispatch(setOrderStatus({ orderId: orders[0].id, status: 'preparing' }) as any);
              }
            }}
          >
            <ThemedText style={styles.demoButtonText}>Set Preparing</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.demoButton, styles.demoButtonShipped]}
            onPress={() => {
              if (orders.length > 0) {
                dispatch(setOrderStatus({ orderId: orders[0].id, status: 'out-for-delivery' }) as any);
              }
            }}
          >
            <ThemedText style={styles.demoButtonText}>Set Shipped</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.demoButton, styles.demoButtonDelivered]}
            onPress={() => {
              if (orders.length > 0) {
                dispatch(setOrderStatus({ orderId: orders[0].id, status: 'delivered' }) as any);
              }
            }}
          >
            <ThemedText style={styles.demoButtonText}>Set Delivered</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ThemedText style={styles.trackingHint}>
          Note: Status changes will be applied to the first order in your list
        </ThemedText>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText>Loading orders...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Error loading orders: {error}</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchUserOrders('current-user-id') as any)}
          >
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="bag" size={48} color="#999" style={styles.emptyIcon} />
          <ThemedText style={styles.emptyTitle}>No orders yet</ThemedText>
          <ThemedText style={styles.emptyText}>Your order history will appear here</ThemedText>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPlaced: {
    backgroundColor: '#FFC107',
  },
  statusPreparing: {
    backgroundColor: '#2196F3',
  },
  statusOutForDelivery: {
    backgroundColor: '#9C27B0',
  },
  statusDelivered: {
    backgroundColor: '#4CAF50',
  },
  statusCancelled: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemQuantity: {
    width: 30,
    fontWeight: '600',
  },
  itemName: {
    flex: 1,
  },
  itemPrice: {
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  // Order tracking demo styles
  trackingDemo: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  trackingControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  demoButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '48%',
  },
  demoButtonPending: {
    backgroundColor: '#FFC107',
  },
  demoButtonPreparing: {
    backgroundColor: '#2196F3',
  },
  demoButtonShipped: {
    backgroundColor: '#9C27B0',
  },
  demoButtonDelivered: {
    backgroundColor: '#4CAF50',
  },
  demoButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  trackingHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
