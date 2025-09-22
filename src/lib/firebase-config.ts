'use client';

import {initializeApp, getApps, getApp, FirebaseApp} from 'firebase/app';
import {getAuth, Auth} from 'firebase/auth';
import {getFirestore, Firestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'studio-8739862538-2f294.firebaseapp.com',
  projectId: 'studio-8739862538-2f294',
  storageBucket: 'studio-8739862538-2f294.appspot.com',
  messagingSenderId: '735448880655',
  appId: '1:735448880655:web:78021380a332bbaabd357a',
};

// Critical check to ensure the environment variable is loaded.
if (!firebaseConfig.apiKey) {
  throw new Error(
    'CRITICAL: NEXT_PUBLIC_FIREBASE_API_KEY is not defined. Please check your .env file.'
  );
}

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export {app, auth, db};
