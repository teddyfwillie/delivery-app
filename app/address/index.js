import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import Button from '../../components/ui/buttons/Button';
import LoadingIndicator from '../../components/ui/feedback/LoadingIndicator';
import ErrorMessage from '../../components/ui/feedback/ErrorMessage';
import Card from '../../components/ui/cards/Card';
import { 
  fetchUserAddresses, 
  setDefaultAddress, 
  deleteAddress 
} from '../../store/slices/userSlice';

export default function AddressManagementScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { addresses, defaultAddressId, loading, error } = useSelector(
    (state) => state.user
  );
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    dispatch(fetchUserAddresses());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleSetDefaultAddress = (addressId) => {
    dispatch(setDefaultAddress(addressId));
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteAddress(addressId)),
        },
      ]
    );
  };

  const handleAddNewAddress = () => {
    router.push('/address/new');
  };

  const handleEditAddress = (address) => {
    router.push({
      pathname: '/address/edit',
      params: { addressId: address.id },
    });
  };

  const renderAddressItem = ({ item }) => {
    const isDefault = item.id === defaultAddressId;
    
    return (
      <Card
        variant="outlined"
        style={styles.addressCard}
      >
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <Ionicons
              name={item.type === 'home' ? 'home-outline' : item.type === 'work' ? 'briefcase-outline' : 'location-outline'}
              size={20}
              color={Colors[colorScheme].text}
            />
            <Text style={[styles.addressType, { color: Colors[colorScheme].text }]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            {isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAddress(item)}
            >
              <Ionicons name="pencil-outline" size={20} color={Colors[colorScheme].text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteAddress(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.addressContent}>
          <Text style={[styles.addressText, { color: Colors[colorScheme].text }]}>
            {item.formattedAddress}
          </Text>
          
          {item.instructions && (
            <Text style={[styles.instructionsText, { color: Colors[colorScheme].text }]}>
              Note: {item.instructions}
            </Text>
          )}
        </View>
        
        {!isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefaultAddress(item.id)}
          >
            <Text style={styles.setDefaultButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingIndicator variant="fullscreen" text="Loading addresses..." />;
    }

    if (error) {
      return (
        <ErrorMessage
          variant="fullscreen"
          title="Error Loading Addresses"
          message={error}
          showRetry
          onRetry={loadAddresses}
        />
      );
    }

    if (addresses.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="location-outline"
            size={64}
            color={Colors[colorScheme].text}
          />
          <Text style={[styles.emptyTitle, { color: Colors[colorScheme].text }]}>
            No Addresses Found
          </Text>
          <Text style={[styles.emptyMessage, { color: Colors[colorScheme].text }]}>
            Add your first address to get started
          </Text>
          <Button
            variant="primary"
            iconName="add-outline"
            onPress={handleAddNewAddress}
            style={styles.addButton}
          >
            Add New Address
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Stack.Screen
        options={{
          title: 'Manage Addresses',
          headerRight: () => (
            addresses.length > 0 ? (
              <TouchableOpacity onPress={handleAddNewAddress}>
                <Ionicons
                  name="add-outline"
                  size={24}
                  color={Colors[colorScheme].text}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            ) : null
          ),
        }}
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  addressCard: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addressContent: {
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  setDefaultButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  setDefaultButtonText: {
    color: '#FF5252',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    minWidth: 200,
  },
});
