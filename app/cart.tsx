import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  FlatList, 
  Pressable, 
  StyleSheet, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Define types for cart items and state
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
  options?: Array<{
    name: string;
    price?: number;
  }>;
  businessId: string;
  businessName: string;
}

interface CartState {
  items: CartItem[];
  businessId: string | null;
  businessName: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponCode: string | null;
  discount: number;
  deliveryAddress: any;
  deliveryInstructions: string;
  loading: boolean;
  error: string | null;
}

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { clearCart, removeItem, updateItemQuantity } from '@/store/slices/cartSlice';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart) as CartState;
  const [isProcessing, setIsProcessing] = useState(false);

  // Format price to display as currency
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  // Handle quantity changes
  const handleUpdateQuantity = (id: string, currentQuantity: number, change: number): void => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      // Ask for confirmation before removing item
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item from your cart?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Remove", 
            onPress: () => dispatch(removeItem(id)),
            style: "destructive"
          }
        ]
      );
    } else {
      dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    }
  };

  // Handle clearing the entire cart
  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your entire cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          onPress: () => dispatch(clearCart()),
          style: "destructive"
        }
      ]
    );
  };

  // Handle checkout
  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to checkout
      router.push('/checkout' as any);
    }, 1000);
  };

  // Render each cart item
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image 
        source={item.image || require('../assets/images/placeholder-food.png')} 
        style={styles.itemImage} 
        contentFit="cover"
      />
      <View style={styles.itemDetails}>
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        <ThemedText style={styles.itemPrice}>{formatPrice(item.price)}</ThemedText>
        {item.options && item.options.length > 0 && (
          <ThemedText style={styles.itemOptions}>
            {item.options.map((option: { name: string }) => option.name).join(', ')}
          </ThemedText>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
        >
          <IconSymbol name="minus.circle" size={24} color="#FF5A5F" />
        </TouchableOpacity>
        <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
        >
          <IconSymbol name="plus.circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty cart view
  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <IconSymbol name="cart" size={80} color="#ccc" />
      <ThemedText style={styles.emptyCartText}>Your cart is empty</ThemedText>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)' as any)}
      >
        <ThemedText style={styles.browseButtonText}>Browse Businesses</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Your Cart</ThemedText>
        {cart.items.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Business Info (if items exist) */}
      {cart.items.length > 0 && (
        <View style={styles.businessInfo}>
          <ThemedText style={styles.businessName}>
            {cart.businessName}
          </ThemedText>
        </View>
      )}

      {/* Cart Items */}
      <FlatList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.cartList}
        ListEmptyComponent={renderEmptyCart}
      />

      {/* Cart Summary */}
      {cart.items.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <ThemedText>Subtotal:</ThemedText>
            <ThemedText>{formatPrice(cart.subtotal)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Tax:</ThemedText>
            <ThemedText>{formatPrice(cart.tax)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Delivery Fee:</ThemedText>
            <ThemedText>{formatPrice(cart.deliveryFee)}</ThemedText>
          </View>
          {cart.discount > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText>Discount:</ThemedText>
              <ThemedText style={styles.discountText}>-{formatPrice(cart.discount)}</ThemedText>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalText}>Total:</ThemedText>
            <ThemedText style={styles.totalPrice}>{formatPrice(cart.total)}</ThemedText>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.checkoutButtonText}>Proceed to Checkout</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#FF5A5F',
  },
  businessInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemOptions: {
    fontSize: 12,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 18,
    marginVertical: 16,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  discountText: {
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#FF5A5F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
