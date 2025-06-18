import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Map from './MapView';
import geolocationService from '../../services/geolocationService';
import { setSelectedLocation, addRecentLocation } from '../../store/slices/locationSlice';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';

const AddressSelector = ({ onAddressSelected, initialAddress }) => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { currentLocation, recentLocations } = useSelector((state) => state.location);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialAddress) {
      setSelectedAddress(initialAddress);
      if (initialAddress.latitude && initialAddress.longitude) {
        setMapRegion({
          latitude: initialAddress.latitude,
          longitude: initialAddress.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    } else if (currentLocation) {
      setMapRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [initialAddress, currentLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await geolocationService.geocodeAddress(searchQuery);
      setSearchResults([results]);
      
      if (results) {
        handleSelectLocation(results);
      }
    } catch (err) {
      setError('Could not find the address. Please try again.');
      console.error('Geocoding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = async (location) => {
    setLoading(true);
    try {
      const address = await geolocationService.reverseGeocodeLocation(
        location.latitude,
        location.longitude
      );
      
      const fullAddress = {
        ...address,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      
      setSelectedAddress(fullAddress);
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      
      dispatch(setSelectedLocation(fullAddress));
      dispatch(addRecentLocation(fullAddress));
      
      if (onAddressSelected) {
        onAddressSelected(fullAddress);
      }
    } catch (err) {
      setError('Could not get address details. Please try again.');
      console.error('Reverse geocoding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapRegionChange = async (region) => {
    setMapRegion(region);
  };

  const confirmLocation = async () => {
    if (!mapRegion) return;
    
    setLoading(true);
    try {
      const address = await geolocationService.reverseGeocodeLocation(
        mapRegion.latitude,
        mapRegion.longitude
      );
      
      const fullAddress = {
        ...address,
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
      };
      
      setSelectedAddress(fullAddress);
      dispatch(setSelectedLocation(fullAddress));
      dispatch(addRecentLocation(fullAddress));
      
      if (onAddressSelected) {
        onAddressSelected(fullAddress);
      }
    } catch (err) {
      setError('Could not confirm location. Please try again.');
      console.error('Confirm location error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderRecentLocation = ({ item }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleSelectLocation(item)}
    >
      <Ionicons name="time-outline" size={20} color={Colors[colorScheme].text} />
      <Text style={[styles.recentText, { color: Colors[colorScheme].text }]}>
        {item.formattedAddress || 'Unknown location'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }
          ]}
          placeholder="Search for an address"
          placeholderTextColor={Colors[colorScheme].tabIconDefault}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {recentLocations.length > 0 && !searchResults.length && (
        <View style={styles.recentContainer}>
          <Text style={[styles.recentTitle, { color: Colors[colorScheme].text }]}>Recent Locations</Text>
          <FlatList
            data={recentLocations}
            renderItem={renderRecentLocation}
            keyExtractor={(item, index) => `recent-${index}`}
            horizontal={false}
            scrollEnabled={false} // Disable scrolling to prevent nested scrollable views warning
          />
        </View>
      )}

      <View style={styles.mapContainer}>
        <Map
          initialRegion={mapRegion}
          onRegionChange={handleMapRegionChange}
          showUserLocation={true}
        />
        <View style={styles.markerFixed}>
          <Ionicons name="location" size={36} color="#FF5252" />
        </View>
      </View>

      <View style={styles.addressContainer}>
        {selectedAddress ? (
          <Text style={[styles.addressText, { color: Colors[colorScheme].text }]}>
            {selectedAddress.formattedAddress}
          </Text>
        ) : (
          <Text style={[styles.placeholderText, { color: Colors[colorScheme].tabIconDefault }]}>
            Move the map to select a location
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, !mapRegion && styles.disabledButton]}
        onPress={confirmLocation}
        disabled={!mapRegion}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FF5252',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 16,
  },
  recentContainer: {
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recentText: {
    marginLeft: 8,
    fontSize: 14,
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  markerFixed: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -18,
    marginTop: -36,
  },
  addressContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: '#FF5252',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddressSelector;
