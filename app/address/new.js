import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AddressSelector from "../../components/maps/AddressSelector";
import Button from "../../components/ui/buttons/Button";
import Input from "../../components/ui/inputs/Input";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { addAddress } from "../../store/slices/userSlice";

const ADDRESS_TYPES = [
  { id: "home", icon: "home-outline", label: "Home" },
  { id: "work", icon: "briefcase-outline", label: "Work" },
  { id: "other", icon: "location-outline", label: "Other" },
];

export default function NewAddressScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressType, setAddressType] = useState("home");
  const [instructions, setInstructions] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleAddressSelected = (address) => {
    setSelectedAddress(address);
    setFormErrors((prev) => ({ ...prev, address: null }));
  };

  const handleAddressTypeSelect = (type) => {
    setAddressType(type);
  };

  const validateForm = () => {
    const errors = {};

    if (!selectedAddress) {
      errors.address = "Please select an address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      const newAddress = {
        ...selectedAddress,
        type: addressType,
        instructions,
      };

      await dispatch(addAddress(newAddress)).unwrap();

      Alert.alert("Success", "Address added successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to add address");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <Stack.Screen
        options={{
          title: "Add New Address",
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapContainer}>
          <AddressSelector onAddressSelected={handleAddressSelected} />
        </View>

        {formErrors.address && (
          <Text style={styles.errorText}>{formErrors.address}</Text>
        )}

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}
          >
            Address Type
          </Text>

          <View style={styles.addressTypeContainer}>
            {ADDRESS_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.addressTypeButton,
                  addressType === type.id && styles.addressTypeButtonSelected,
                  { borderColor: Colors[colorScheme].border },
                ]}
                onPress={() => handleAddressTypeSelect(type.id)}
              >
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={
                    addressType === type.id
                      ? "#FFFFFF"
                      : Colors[colorScheme].text
                  }
                />
                <Text
                  style={[
                    styles.addressTypeText,
                    {
                      color:
                        addressType === type.id
                          ? "#FFFFFF"
                          : Colors[colorScheme].text,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}
          >
            Delivery Instructions (Optional)
          </Text>

          <Input
            placeholder="E.g., Ring the doorbell, call when outside, etc."
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
            style={styles.instructionsInput}
          />
        </View>

        <Button
          variant="primary"
          isFullWidth
          isLoading={loading}
          onPress={handleSaveAddress}
          style={styles.saveButton}
        >
          Save Address
        </Button>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  mapContainer: {
    height: 350,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressTypeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  addressTypeButtonSelected: {
    backgroundColor: "#FF5252",
    borderColor: "#FF5252",
  },
  addressTypeText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  instructionsInput: {
    height: 100,
  },
  saveButton: {
    marginTop: 16,
  },
  errorText: {
    color: "#F44336",
    marginTop: 8,
    fontSize: 14,
  },
});
