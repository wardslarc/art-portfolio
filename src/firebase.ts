// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA3pKSeEutcBDXwjVKN376IuIzl4gFmEr4",
    authDomain: "artist-portfolio-5c31e.firebaseapp.com",
    databaseURL: "https://artist-portfolio-5c31e-default-rtdb.firebaseio.com",
    projectId: "artist-portfolio-5c31e",
    storageBucket: "artist-portfolio-5c31e.firebasestorage.app",
    messagingSenderId: "1012166433286",
    appId: "1:1012166433286:web:d7f8e5c6b0e440386e0187",
    measurementId: "G-J4VDFYGPHZ"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app); // ✅ enables Firebase Storage
