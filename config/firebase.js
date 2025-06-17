// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-47EsffhuB3rRtoF0uNAqmxqGNB_WlfM",
  authDomain: "delivery-service-app-b80ab.firebaseapp.com",
  projectId: "delivery-service-app-b80ab",
  storageBucket: "delivery-service-app-b80ab.firebasestorage.app",
  messagingSenderId: "849317324726",
  appId: "1:849317324726:web:ed5548b26f7d6fd8268317",
  measurementId: "G-CEBQLGDRQL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
