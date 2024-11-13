import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiaWhPqzZTG429BbeGFhTDVDixkPwADgM",
  authDomain: "genlink-7f986.firebaseapp.com",
  projectId: "genlink-7f986",
  storageBucket: "genlink-7f986.firebasestorage.app",
  messagingSenderId: "1084098783321",
  appId: "1:1084098783321:web:776fe72dd0ed9a06292948",
  measurementId: "G-YQ2EP9VJ4B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
