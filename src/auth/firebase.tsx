import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

async function getUserData(collection: string, uid: string) {

  // temporary
  // return {"avatar": "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg", "bio": "This Hacker didn't set up their bio yet :(", "createdAt": {"nanoseconds": 889000000, "seconds": 1754556026, "type": "firestore/timestamp/1.0"}, "displayName": "Shibam Roy", "email": "royshibam9826@gmail.com", "friends": [], "liked_posts": [], "num_logs": 0, "num_trackers": 0, "num_tracking": 0, "posts": [], "uid": "BJ1R4y5EHIb9zV4XAet61K2UI5s1"};

  if (!uid) {
    return;
  }
  const docRef = doc(db, collection, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export { auth, db, getUserData };
