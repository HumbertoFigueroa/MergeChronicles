// src/lib/firebase-client.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnFgtwCjJm5f5JZXYXeHzknErfMJTW73Y",
  authDomain: "studio-8739862538-2f294.firebaseapp.com",
  projectId: "studio-8739862538-2f294",
  storageBucket: "studio-8739862538-2f294.appspot.com",
  messagingSenderId: "735448880655",
  appId: "1:735448880655:web:78021380a332bbaabd357a"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
