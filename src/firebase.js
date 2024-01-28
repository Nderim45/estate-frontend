// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "real-estate-2482b.firebaseapp.com",
  projectId: "real-estate-2482b",
  storageBucket: "real-estate-2482b.appspot.com",
  messagingSenderId: "755118913809",
  appId: "1:755118913809:web:d66550f7bce585f38774b0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
