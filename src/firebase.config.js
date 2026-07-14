import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Loading configuration keys from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "mock_firebase_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN || "mock_auth_domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID || "mock_project_id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET || "mock_project_id.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APPID || "1:1234567890:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
