// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage'; //MUDEI AQUI
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTnVmV-clcfm0qp9Bbw398IrPGexUz7mE",
  authDomain: "medi-track-95642.firebaseapp.com",
  projectId: "medi-track-95642",
  storageBucket: "medi-track-95642.firebasestorage.app",
  messagingSenderId: "1097402944557",
  appId: "1:1097402944557:web:3ae8441d4d95c66c31fca4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth=getAuth(app)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) //MUDEI AQUI
});

export const db=getFirestore(app)