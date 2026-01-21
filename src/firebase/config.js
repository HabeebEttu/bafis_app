// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getFunctions} from "firebase/functions"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBAX8O_6uFiD4NCntP_krRnO2bX5y07PY",
  authDomain: "bafis-app.firebaseapp.com",
  projectId: "bafis-app",
  storageBucket: "bafis-app.firebasestorage.app",
  messagingSenderId: "73463716505",
  appId: "1:73463716505:web:c71f4bfe1cb2e80a3fb608",
  measurementId: "G-2P0FHGKPRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export default app;