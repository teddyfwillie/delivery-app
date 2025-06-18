import * as Location from 'expo-location';
import { GeoPoint } from 'firebase/firestore';

class GeolocationService {
  // Request location permissions
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      throw error;
    }
  }

  // Check location permissions
  async checkPermissions() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error checking location permissions:', error);
      throw error;
    }
  }

  // Get current location
  async getCurrentLocation() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  // Get location updates
  watchLocation(callback, errorCallback) {
    try {
      const locationSubscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update if moved by 10 meters
        },
        (location) => {
          const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          };
          
          callback(locationData);
        }
      ).catch(error => {
        if (errorCallback) {
          errorCallback(error);
        } else {
          console.error('Error watching location:', error);
        }
      });
      
      // Return the subscription so it can be removed later
      return locationSubscription;
    } catch (error) {
      console.error('Error setting up location watcher:', error);
      if (errorCallback) {
        errorCallback(error);
      }
      throw error;
    }
  }

  // Stop watching location
  async stopWatchingLocation(locationSubscription) {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  }

  // Geocode an address to coordinates
  async geocodeAddress(address) {
    try {
      const results = await Location.geocodeAsync(address);
      
      if (results.length > 0) {
        return {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
        };
      } else {
        throw new Error('No results found for the address');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocodeLocation(latitude, longitude) {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (results.length > 0) {
        const location = results[0];
        
        // Format the address
        const addressParts = [];
        
        if (location.name) addressParts.push(location.name);
        if (location.street) addressParts.push(location.street);
        if (location.district) addressParts.push(location.district);
        if (location.city) addressParts.push(location.city);
        if (location.region) addressParts.push(location.region);
        if (location.postalCode) addressParts.push(location.postalCode);
        if (location.country) addressParts.push(location.country);
        
        return {
          formattedAddress: addressParts.join(', '),
          ...location,
          coordinates: {
            latitude,
            longitude,
          },
        };
      } else {
        throw new Error('No address found for the coordinates');
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  // Calculate distance between two points (in kilometers)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  // Convert degrees to radians
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Create a GeoPoint for Firestore
  createGeoPoint(latitude, longitude) {
    return new GeoPoint(latitude, longitude);
  }

  // Get estimated travel time between two points (in minutes)
  // This is a simplified calculation, in a real app you would use a routing API
  estimateTravelTime(lat1, lon1, lat2, lon2, travelMode = 'driving') {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    let speed;
    
    // Estimated speeds in km/h
    switch (travelMode) {
      case 'walking':
        speed = 5;
        break;
      case 'bicycling':
        speed = 15;
        break;
      case 'driving':
      default:
        speed = 30; // Urban driving average
        break;
    }
    
    // Convert to minutes: (distance / speed) * 60
    const timeInMinutes = (distance / speed) * 60;
    return Math.round(timeInMinutes);
  }
}

export default new GeolocationService();
