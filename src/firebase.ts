// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBzhPrmFx4G4kwWzSunMjt_Yz5R2bxCBxk",
	authDomain: "household-typescript-15596.firebaseapp.com",
	projectId: "household-typescript-15596",
	storageBucket: "household-typescript-15596.firebasestorage.app",
	messagingSenderId: "189195425483",
	appId: "1:189195425483:web:3936a11033302a3ef72d4e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
