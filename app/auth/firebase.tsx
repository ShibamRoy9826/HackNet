// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth= getAuth(app);
export {auth};
