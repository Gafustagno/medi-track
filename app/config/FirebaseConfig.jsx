// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnX4bTlU8Lf3RDRoTUAsUCzzyyCf6S3lQ",
  authDomain: "medi-track-19bf1.firebaseapp.com",
  projectId: "medi-track-19bf1",
  storageBucket: "medi-track-19bf1.firebasestorage.app",
  messagingSenderId: "878467364752",
  appId: "1:878467364752:web:6d66fe47f413f666fc2515"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth=getAuth(app)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db=getFirestore(app)