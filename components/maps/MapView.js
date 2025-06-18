import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLocation } from '../../store/slices/locationSlice';
import geolocationService from '../../services/geolocationService';

const Map = ({
  initialRegion,
  markers = [],
  showUserLocation = true,
  onRegionChange,
  onMarkerPress,
  mapStyle,
  children,
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const { currentLocation } = useSelector((state) => state.location);
  const [region, setRegion] = useState(
    initialRegion || {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  );

  useEffect(() => {
    if (!initialRegion && !currentLocation) {
      getCurrentLocation();
    }
  }, [initialRegion, currentLocation]);

  useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
    }
  }, [initialRegion]);

  const getCurrentLocation = async () => {
    try {
      const status = await geolocationService.checkPermissions();
      
      if (status !== 'granted') {
        const newStatus = await geolocationService.requestPermissions();
        if (newStatus !== 'granted') {
          return;
        }
      }
      
      const location = await geolocationService.getCurrentLocation();
      
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      dispatch(setCurrentLocation(location));
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    if (onRegionChange) {
      onRegionChange(newRegion);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={[styles.map, mapStyle]}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={showUserLocation}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={handleRegionChange}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || `marker-${index}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => onMarkerPress && onMarkerPress(marker)}
            image={marker.image}
          />
        ))}
        {children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Map;
