// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnFgtwCjJm5f5JZXYXeHzknErfMJTW73Y",
  authDomain: "studio-8739862538-2f294.firebaseapp.com",
  projectId: "studio-8739862538-2f294",
  storageBucket: "studio-8739862538-2f294.appspot.com",
  messagingSenderId: "735448880655",
  appId: "1:735448880655:web:78021380a332bbaabd357a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
