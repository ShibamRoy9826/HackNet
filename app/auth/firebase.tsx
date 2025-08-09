// Import the functions you need from the SDKs you need
import {initializeApp } from "firebase/app";
import {doc,getDoc,getFirestore} from "firebase/firestore";
import {getAuth,initializeAuth,getReactNativePersistence} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB69-jENuosOyjW9lCwj6EH7Ss3li17Kh0",
  authDomain: "hacknet-e893b.firebaseapp.com",
  projectId: "hacknet-e893b",
  storageBucket: "hacknet-e893b.firebasestorage.app",
  messagingSenderId: "16905701067",
  appId: "1:16905701067:web:c9600f177f08568fcbfd4e",
  measurementId: "G-8NZL4W987Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db=getFirestore(app);

async function getUserData(collection:string) {
  // temporary
  // return {"avatar": "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg", "bio": "This Hacker didn't set up their bio yet :(", "createdAt": {"nanoseconds": 889000000, "seconds": 1754556026, "type": "firestore/timestamp/1.0"}, "displayName": "Shibam Roy", "email": "royshibam9826@gmail.com", "friends": [], "liked_posts": [], "num_logs": 0, "num_trackers": 0, "num_tracking": 0, "posts": [], "uid": "BJ1R4y5EHIb9zV4XAet61K2UI5s1"};
  const user=auth.currentUser;
  if(!user){
    return;
  }
  const docRef=doc(db,collection,user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Got data",docSnap.data());
    return docSnap.data();
  } else {
    console.log("got nothing:(")
    return null;
  }
}


export {auth,db,getUserData};