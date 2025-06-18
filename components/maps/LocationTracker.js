import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { setCurrentLocation } from '../../store/slices/locationSlice';
import geolocationService from '../../services/geolocationService';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const LocationTracker = ({
  destination,
  showRoute = true,
  showETA = true,
  onLocationUpdate,
  mapStyle,
}) => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);
  const { currentLocation } = useSelector((state) => state.location);
  
  const [tracking, setTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [region, setRegion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize with current location if available
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      getCurrentLocation();
    }

    // Clean up subscription when component unmounts
    return () => {
      if (locationSubscription) {
        geolocationService.stopWatchingLocation(locationSubscription);
      }
    };
  }, []);

  useEffect(() => {
    // Update route and ETA when current location or destination changes
    if (currentLocation && destination) {
      calculateRouteAndETA();
    }
  }, [currentLocation, destination]);

  const getCurrentLocation = async () => {
    try {
      const status = await geolocationService.checkPermissions();
      
      if (status !== 'granted') {
        const newStatus = await geolocationService.requestPermissions();
        if (newStatus !== 'granted') {
          setError('Location permission not granted');
          return;
        }
      }
      
      const location = await geolocationService.getCurrentLocation();
      
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      
      setRegion(newRegion);
      dispatch(setCurrentLocation(location));
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      setError('Could not get current location');
    }
  };

  const startTracking = async () => {
    try {
      const status = await geolocationService.checkPermissions();
      
      if (status !== 'granted') {
        const newStatus = await geolocationService.requestPermissions();
        if (newStatus !== 'granted') {
          setError('Location permission not granted');
          return;
        }
      }
      
      // Start watching location
      const subscription = await geolocationService.watchLocation(
        (location) => {
          // Update current location
          dispatch(setCurrentLocation(location));
          
          // Update route coordinates
          if (showRoute) {
            setRouteCoordinates((prev) => [
              ...prev,
              {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            ]);
          }
          
          // Update region to follow user
          const newRegion = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          
          setRegion(newRegion);
          
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion);
          }
          
          // Calculate ETA and distance if destination is provided
          if (destination) {
            calculateRouteAndETA();
          }
          
          // Call the callback if provided
          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        },
        (error) => {
          console.error('Location tracking error:', error);
          setError('Error tracking location');
          setTracking(false);
        }
      );
      
      setLocationSubscription(subscription);
      setTracking(true);
      setError(null);
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setError('Could not start location tracking');
    }
  };

  const stopTracking = () => {
    if (locationSubscription) {
      geolocationService.stopWatchingLocation(locationSubscription);
      setLocationSubscription(null);
      setTracking(false);
    }
  };

  const calculateRouteAndETA = () => {
    if (!currentLocation || !destination) return;
    
    // Calculate distance
    const calculatedDistance = geolocationService.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      destination.latitude,
      destination.longitude
    );
    
    setDistance(calculatedDistance);
    
    // Calculate ETA (estimated time of arrival)
    const estimatedTime = geolocationService.estimateTravelTime(
      currentLocation.latitude,
      currentLocation.longitude,
      destination.latitude,
      destination.longitude
    );
    
    setEta(estimatedTime);
    
    // In a real app, you would use a routing API to get the actual route
    // For now, we'll just create a straight line between current location and destination
    if (showRoute) {
      setRouteCoordinates([
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      ]);
    }
  };

  const fitMapToMarkers = () => {
    if (mapRef.current && currentLocation && destination) {
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  };

  const renderETA = () => {
    if (!showETA || !eta || !distance) return null;
    
    return (
      <View style={styles.etaContainer}>
        <Text style={styles.etaText}>
          ETA: {eta} min ({distance.toFixed(1)} km)
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={[styles.map, mapStyle]}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title={destination.title || 'Destination'}
              description={destination.description}
            />
          )}
          
          {showRoute && routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={4}
              strokeColor="#FF5252"
            />
          )}
        </MapView>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            tracking ? styles.stopButton : styles.startButton,
          ]}
          onPress={tracking ? stopTracking : startTracking}
        >
          <Text style={styles.buttonText}>
            {tracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
        
        {destination && (
          <TouchableOpacity style={styles.fitButton} onPress={fitMapToMarkers}>
            <Ionicons name="expand-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      {renderETA()}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fitButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
  },
  etaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LocationTracker;
