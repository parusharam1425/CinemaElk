import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCSfOIS2IFv8shK9Ecjn2HgyNjyPOXWrXs",
    authDomain: "fir-b1fd7.firebaseapp.com",
    projectId: "fir-b1fd7",
    storageBucket: "fir-b1fd7.appspot.com",
    messagingSenderId: "60674587231",
    appId: "1:60674587231:web:b5d33414bbd06bc182f9ea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);