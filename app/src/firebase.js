// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: 'youcode-project.firebaseapp.com',
  projectId: 'youcode-project',
  storageBucket: 'youcode-project.appspot.com',
  messagingSenderId: '165677684862',
  appId: '1:165677684862:web:11823857c76de07c74602f',
  measurementId: 'G-6MMNP1H4LQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);  // This is optional if you want to track app usage
const db = getFirestore(app);         // Firebase Firestore for database interaction
const auth = getAuth(app);           // Firebase Authentication for user management

// Export the services to be used in your app
export { app, db, auth, analytics };
