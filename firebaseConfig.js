// Import the necessary functions from Firebase SDK v9
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyD1v-9mpLHKSvKSRF8vPnAGy3zLlqMpdVk",
    authDomain: "local-metals-recyclers.firebaseapp.com",
    projectId: "local-metals-recyclers",
    storageBucket: "local-metals-recyclers.appspot.com",
    messagingSenderId: "345749774126",
    appId: "1:345749774126:web:368e62c80ae003b5a7e4bf",
    measurementId: "G-3ZPZ7FXJ3E"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase storage
const storage = getStorage(app);

export { storage };
