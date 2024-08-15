// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg-5b2rGfGhb7h-gwUNFWV6KjH_0_IMbI",
  authDomain: "flashcardsaas-90728.firebaseapp.com",
  projectId: "flashcardsaas-90728",
  storageBucket: "flashcardsaas-90728.appspot.com",
  messagingSenderId: "950359597983",
  appId: "1:950359597983:web:94a64d548dc81f2cdd53aa",
  measurementId: "G-4CHHZ4YQ83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);