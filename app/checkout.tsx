import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserAddresses } from '../store/slices/userSlice';
import { saveOrder } from '../store/slices/orderSlice';
import { store } from '../store';

// Define AppDispatch type directly in this file
type AppDispatch = typeof store.dispatch;

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { setDeliveryAddress, clearCart } from '@/store/slices/cartSlice';

export default function CheckoutScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: any) => state.cart);
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const { addresses, defaultAddressId } = useSelector((state: any) => state.user);
  
  const [address, setAddress] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });
  
  // Handle address input changes
  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Validate address and move to next step
  const handleAddressSubmit = () => {
    if (useNewAddress) {
      // Basic validation for new address
      if (!address.street || !address.city || !address.state || !address.zipCode) {
        Alert.alert('Incomplete Address', 'Please fill in all required fields.');
        return;
      }
      
      // Save new address to cart state
      dispatch(setDeliveryAddress(address));
    } else {
      // Validate selected address
      if (!selectedAddressId) {
        Alert.alert('No Address Selected', 'Please select an address or add a new one.');
        return;
      }
      
      // Find the selected address
      const selectedAddress = addresses.find((addr: any) => addr.id === selectedAddressId);
      if (selectedAddress) {
        // Format the address for the cart
        const deliveryAddress = {
          street: selectedAddress.street,
          apartment: selectedAddress.apartment || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          instructions: selectedAddress.instructions || ''
        };
        
        // Save selected address to cart state
        dispatch(setDeliveryAddress(deliveryAddress));
      }
    }
    
    // Move to payment step
    setCurrentStep(2);
  };
  
  // Header with back button
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => {
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          } else {
            router.back();
          }
        }}
      >
        <IconSymbol name="chevron.left" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
      </TouchableOpacity>
      <ThemedText style={styles.headerTitle}>
        {currentStep === 1 ? 'Delivery Address' : 
         currentStep === 2 ? 'Payment Method' : 'Order Review'}
      </ThemedText>
      {/* Empty view for alignment */}
      <View style={{ width: 24 }} />
    </View>
  );
  
  useEffect(() => {
    // Load saved addresses
    dispatch(fetchUserAddresses() as any);
    
    // Set default address if available
    if (defaultAddressId && addresses.length > 0) {
      setSelectedAddressId(defaultAddressId);
    }
  }, [dispatch, defaultAddressId, addresses.length]);

  // Render saved addresses
  const renderSavedAddresses = () => {
    if (addresses.length === 0) {
      return (
        <View style={styles.emptyAddressContainer}>
          <ThemedText style={styles.emptyAddressText}>No saved addresses found.</ThemedText>
        </View>
      );
    }
    
    return (
      <View style={styles.savedAddressesContainer}>
        {addresses.map((savedAddress: any) => (
          <TouchableOpacity
            key={savedAddress.id}
            style={[
              styles.savedAddressCard,
              selectedAddressId === savedAddress.id && styles.selectedAddressCard
            ]}
            onPress={() => setSelectedAddressId(savedAddress.id)}
          >
            <View style={styles.savedAddressHeader}>
              <View style={styles.savedAddressType}>
                <IconSymbol 
                  name={savedAddress.type === 'home' ? 'house' : 
                        savedAddress.type === 'work' ? 'briefcase' : 'location'} 
                  size={18} 
                  color={colorScheme === 'dark' ? '#fff' : '#000'} 
                />
                <ThemedText style={styles.savedAddressTypeText}>
                  {savedAddress.type.charAt(0).toUpperCase() + savedAddress.type.slice(1)}
                </ThemedText>
                {savedAddress.id === defaultAddressId && (
                  <View style={styles.defaultBadge}>
                    <ThemedText style={styles.defaultBadgeText}>Default</ThemedText>
                  </View>
                )}
              </View>
              {selectedAddressId === savedAddress.id && (
                <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
              )}
            </View>
            
            <ThemedText style={styles.savedAddressText}>
              {savedAddress.street}{savedAddress.apartment ? `, ${savedAddress.apartment}` : ''}
            </ThemedText>
            <ThemedText style={styles.savedAddressText}>
              {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}
            </ThemedText>
            {savedAddress.instructions && (
              <ThemedText style={styles.savedAddressInstructions}>
                Note: {savedAddress.instructions}
              </ThemedText>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render address form
  const renderAddressForm = () => (
    <View style={styles.formContainer}>
      <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
      
      {/* Toggle between saved addresses and new address */}
      {addresses.length > 0 && (
        <View style={styles.addressToggleContainer}>
          <TouchableOpacity
            style={[
              styles.addressToggleButton,
              !useNewAddress && styles.activeAddressToggle
            ]}
            onPress={() => setUseNewAddress(false)}
          >
            <ThemedText style={[styles.addressToggleText, !useNewAddress && styles.activeAddressToggleText]}>
              Saved Addresses
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addressToggleButton,
              useNewAddress && styles.activeAddressToggle
            ]}
            onPress={() => setUseNewAddress(true)}
          >
            <ThemedText style={[styles.addressToggleText, useNewAddress && styles.activeAddressToggleText]}>
              New Address
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Show saved addresses or new address form */}
      {!useNewAddress && addresses.length > 0 ? (
        <>
          {renderSavedAddresses()}
          
          {/* Add Continue to Payment button for saved addresses */}
          {selectedAddressId && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleAddressSubmit}
            >
              <ThemedText style={styles.primaryButtonText}>Continue to Payment</ThemedText>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Street Address *</ThemedText>
            <TextInput
              style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
              value={address.street}
              onChangeText={(text) => handleAddressChange('street', text)}
              placeholder="123 Main St"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Apartment/Suite (Optional)</ThemedText>
            <TextInput
              style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
              value={address.apartment}
              onChangeText={(text) => handleAddressChange('apartment', text)}
              placeholder="Apt #, Suite #, etc."
              placeholderTextColor="#999"
            />
          </View>
      
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
              <ThemedText style={styles.inputLabel}>City *</ThemedText>
              <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
                value={address.city}
                onChangeText={(text) => handleAddressChange('city', text)}
                placeholder="City"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <ThemedText style={styles.inputLabel}>State *</ThemedText>
              <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
                value={address.state}
                onChangeText={(text) => handleAddressChange('state', text)}
                placeholder="State"
                placeholderTextColor="#999"
                maxLength={2}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <ThemedText style={styles.inputLabel}>Zip *</ThemedText>
              <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
                value={address.zipCode}
                onChangeText={(text) => handleAddressChange('zipCode', text)}
                placeholder="12345"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddressSubmit}
          >
            <ThemedText style={styles.primaryButtonText}>Continue to Payment</ThemedText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
  // Render payment method selection
  const renderPaymentMethodSelection = () => (
    <View style={styles.formContainer}>
      <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
      
      <TouchableOpacity 
        style={[styles.paymentOption, paymentMethod === 'credit' && styles.selectedPayment]}
        onPress={() => setPaymentMethod('credit')}
      >
        <View style={styles.paymentIconContainer}>
          <IconSymbol name="creditcard" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
        <View style={styles.paymentDetails}>
          <ThemedText style={styles.paymentTitle}>Credit Card</ThemedText>
          <ThemedText style={styles.paymentSubtitle}>Pay with Visa, Mastercard, etc.</ThemedText>
        </View>
        {paymentMethod === 'credit' && (
          <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.paymentOption, paymentMethod === 'paypal' && styles.selectedPayment]}
        onPress={() => setPaymentMethod('paypal')}
      >
        <View style={styles.paymentIconContainer}>
          <IconSymbol name="dollarsign.circle" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
        <View style={styles.paymentDetails}>
          <ThemedText style={styles.paymentTitle}>PayPal</ThemedText>
          <ThemedText style={styles.paymentSubtitle}>Pay with your PayPal account</ThemedText>
        </View>
        {paymentMethod === 'paypal' && (
          <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.paymentOption, paymentMethod === 'cash' && styles.selectedPayment]}
        onPress={() => setPaymentMethod('cash')}
      >
        <View style={styles.paymentIconContainer}>
          <IconSymbol name="banknote" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
        <View style={styles.paymentDetails}>
          <ThemedText style={styles.paymentTitle}>Cash on Delivery</ThemedText>
          <ThemedText style={styles.paymentSubtitle}>Pay when your order arrives</ThemedText>
        </View>
        {paymentMethod === 'cash' && (
          <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setCurrentStep(3)}
      >
        <ThemedText style={styles.primaryButtonText}>Review Order</ThemedText>
      </TouchableOpacity>
    </View>
  );
  
  // Format price to display as currency
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };
  
  // Handle order placement
  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Create order data from cart and user selections
    const orderData = {
      items: cart.items,
      businessId: cart.businessId,
      businessName: cart.businessName,
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      total: cart.total,
      paymentMethod,
      deliveryAddress: cart.deliveryAddress,
      deliveryInstructions: cart.deliveryInstructions || '',
    };
    
    // Dispatch action to save order
    dispatch(saveOrder(orderData))
      .unwrap()
      .then(() => {
        setIsProcessing(false);
        setOrderComplete(true);
        
        // Clear cart after successful order
        // dispatch(clearCart());
      })
      .catch((error: any) => {
        setIsProcessing(false);
        Alert.alert('Error', 'Failed to place order. Please try again.');
        console.error('Order placement error:', error);
      });
  };
  
  // Render order summary and confirmation
  const renderOrderSummary = () => (
    <View style={styles.formContainer}>
      {orderComplete ? (
        // Order success view
        <View style={styles.orderSuccessContainer}>
          <View style={styles.orderSuccessIcon}>
            <IconSymbol name="checkmark.circle.fill" size={80} color="#4CAF50" />
          </View>
          <ThemedText style={styles.orderSuccessTitle}>Order Placed!</ThemedText>
          <ThemedText style={styles.orderSuccessMessage}>
            Your order has been successfully placed. You can track your order status in the Orders section.
          </ThemedText>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)' as any)}
          >
            <ThemedText style={styles.primaryButtonText}>Back to Home</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        // Order summary view
        <>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          
          {/* Business info */}
          <View style={styles.summarySection}>
            <ThemedText style={styles.summaryBusinessName}>{cart.businessName}</ThemedText>
          </View>
          
          {/* Items */}
          <View style={styles.summarySection}>
            <ThemedText style={styles.summarySectionTitle}>Items</ThemedText>
            {cart.items.map((item: any) => (
              <View key={item.id} style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <ThemedText style={styles.summaryItemName}>
                    {item.quantity}x {item.name}
                  </ThemedText>
                  {item.options && item.options.length > 0 && (
                    <ThemedText style={styles.summaryItemOptions}>
                      {item.options.map((option: any) => option.name).join(', ')}
                    </ThemedText>
                  )}
                </View>
                <ThemedText style={styles.summaryItemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </ThemedText>
              </View>
            ))}
          </View>
          
          {/* Delivery address */}
          <View style={styles.summarySection}>
            <ThemedText style={styles.summarySectionTitle}>Delivery Address</ThemedText>
            <ThemedText style={styles.summaryAddress}>
              {address.street}{address.apartment ? `, ${address.apartment}` : ''}
            </ThemedText>
            <ThemedText style={styles.summaryAddress}>
              {address.city}, {address.state} {address.zipCode}
            </ThemedText>
            {address.instructions && (
              <ThemedText style={styles.summaryInstructions}>
                Note: {address.instructions}
              </ThemedText>
            )}
          </View>
          
          {/* Payment method */}
          <View style={styles.summarySection}>
            <ThemedText style={styles.summarySectionTitle}>Payment Method</ThemedText>
            <ThemedText style={styles.summaryPaymentMethod}>
              {paymentMethod === 'credit' && 'Credit Card'}
              {paymentMethod === 'paypal' && 'PayPal'}
              {paymentMethod === 'cash' && 'Cash on Delivery'}
            </ThemedText>
          </View>
          
          {/* Cost breakdown */}
          <View style={[styles.summarySection, styles.costBreakdown]}>
            <View style={styles.costRow}>
              <ThemedText>Subtotal</ThemedText>
              <ThemedText>{formatPrice(cart.subtotal)}</ThemedText>
            </View>
            <View style={styles.costRow}>
              <ThemedText>Tax</ThemedText>
              <ThemedText>{formatPrice(cart.tax)}</ThemedText>
            </View>
            <View style={styles.costRow}>
              <ThemedText>Delivery Fee</ThemedText>
              <ThemedText>{formatPrice(cart.deliveryFee)}</ThemedText>
            </View>
            {cart.discount > 0 && (
              <View style={styles.costRow}>
                <ThemedText>Discount</ThemedText>
                <ThemedText style={styles.discountText}>-{formatPrice(cart.discount)}</ThemedText>
              </View>
            )}
            <View style={styles.totalRow}>
              <ThemedText style={styles.totalText}>Total</ThemedText>
              <ThemedText style={styles.totalPrice}>{formatPrice(cart.total)}</ThemedText>
            </View>
          </View>
          
          {/* Place order button */}
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.primaryButtonText}>Place Order</ThemedText>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderAddressForm()}
        {currentStep === 2 && renderPaymentMethodSelection()}
        {currentStep === 3 && renderOrderSummary()}
      </ScrollView>
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
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputDark: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  textArea: {
    height: 80,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPayment: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summarySection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryBusinessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  summaryItemName: {
    fontSize: 15,
  },
  summaryItemOptions: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryAddress: {
    fontSize: 15,
    marginBottom: 4,
  },
  summaryInstructions: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 8,
  },
  summaryPaymentMethod: {
    fontSize: 15,
  },
  costBreakdown: {
    marginTop: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  discountText: {
    color: '#4CAF50',
  },
  orderSuccessContainer: {
    alignItems: 'center',
    padding: 16,
  },
  orderSuccessIcon: {
    marginVertical: 24,
  },
  orderSuccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderSuccessMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addressToggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressToggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  activeAddressToggle: {
    backgroundColor: '#FF5A5F',
  },
  addressToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeAddressToggleText: {
    color: '#fff',
  },
  savedAddressesContainer: {
    marginBottom: 16,
  },
  savedAddressCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedAddressCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  savedAddressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedAddressType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedAddressTypeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  savedAddressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  savedAddressInstructions: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
  },
  emptyAddressContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  emptyAddressText: {
    fontSize: 14,
    color: '#666',
  },
});
