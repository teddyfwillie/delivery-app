import { Stack } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';

export default function AddressLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme || 'light'].background,
        },
        headerTintColor: Colors[colorScheme || 'light'].text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: "Manage Addresses" }}
      />
      <Stack.Screen 
        name="new" 
        options={{ title: "Add New Address" }}
      />
      <Stack.Screen 
        name="edit" 
        options={{ title: "Edit Address" }}
      />
    </Stack>
  );
}
