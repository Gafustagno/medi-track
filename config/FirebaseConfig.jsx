//app\config\FirebaseConfig.jsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Configuracao do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCTnVmV-clcfm0qp9Bbw398IrPGexUz7mE",
  authDomain: "medi-track-95642.firebaseapp.com",
  projectId: "medi-track-95642",
  storageBucket: "medi-track-95642.firebasestorage.app",
  messagingSenderId: "1097402944557",
  appId: "1:1097402944557:web:3ae8441d4d95c66c31fca4"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// export const auth=getAuth(app)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) 
});

export const db=getFirestore(app)