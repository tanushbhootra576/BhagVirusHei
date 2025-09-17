// This is a utility script to verify your Firebase config is correctly loaded

// Verify Firebase config is present and log missing keys
export const checkFirebaseConfig = () => {
  const cfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  const missing = Object.entries(cfg)
    .filter(([, v]) => !v || String(v).includes('undefined') || String(v).trim() === '')
    .map(([k]) => k);
  if (missing.length) {
    console.error('Missing Firebase config values:', missing.join(', '));
    return false;
  }
  console.log('Firebase configuration looks good!');
  return true;
};

// Add this to your main.jsx to run the check on startup
// import { checkFirebaseConfig } from './utils/firebaseConfigCheck';
// checkFirebaseConfig();