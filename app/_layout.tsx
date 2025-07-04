import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import store from "../store";

// Auth protection for routes
function AuthProtection() {
  const { currentUser, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === "(tabs)";
      // List of public routes that don't require authentication and shouldn't redirect
      const publicRoutes = ["business", "category", "search", "profile", "change-password", "address", "cart", "checkout"];
      
      if (!currentUser && inAuthGroup) {
        // Redirect to login if user is not authenticated but trying to access protected routes
        router.replace("/login");
      } else if (
        currentUser &&
        !inAuthGroup &&
        !publicRoutes.includes(segments[0])
      ) {
        // Redirect to home if user is authenticated and trying to access auth screens
        // But allow navigation to public routes like business, category, search, etc.
        router.replace("/(tabs)");
      }
    }
  }, [currentUser, loading, segments]);

  return null;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProtection />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen
          name="forgot-password"
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen
          name="change-password"
          options={{ title: "Change Password" }}
        />
        <Stack.Screen 
          name="address" 
          options={{ headerShown: false }}
        />
        {/* Address routes are handled by the nested layout in app/address/_layout.js */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </Provider>
  );
}
