import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer', 'business', 'driver'
  const [loading, setLoading] = useState(true);

  // Register a new user
  async function register(email, password, fullName, type) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        fullName,
        type, // 'customer', 'business', 'driver'
        createdAt: new Date().toISOString(),
        isVerified: false,
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Login with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Google sign in
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          fullName: result.user.displayName,
          type: "customer", // Default to customer for social logins
          createdAt: new Date().toISOString(),
          isVerified: result.user.emailVerified,
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Facebook sign in
  async function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          fullName: result.user.displayName,
          type: "customer", // Default to customer for social logins
          createdAt: new Date().toISOString(),
          isVerified: result.user.emailVerified,
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async function updateUserProfile(data) {
    if (!currentUser) throw new Error("No user logged in");

    try {
      // Update auth profile if name is provided
      if (data.fullName) {
        await updateProfile(currentUser, {
          displayName: data.fullName,
        });
      }

      // Update user document in Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get user type from Firestore
  async function fetchUserType(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserType(userDoc.data().type);
        return userDoc.data().type;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user type:", error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserType(user.uid);
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userType,
    register,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    updateUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
