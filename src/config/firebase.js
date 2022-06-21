import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

// Use your own configs!
const app = firebase.initializeApp({
    apiKey: "AIzaSyAd_YHSNEGYvdnvx-pJKYpBGpgseu7ZEKg",
    authDomain: "auctioner-a806a.firebaseapp.com",
    projectId: "auctioner-a806a",
    storageBucket: "auctioner-a806a.appspot.com",
    messagingSenderId: "889261068959",
    appId: "1:889261068959:web:470ac248697b87bb5c08aa",
});

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const firestoreApp = app.firestore();
export const storageApp = app.storage();
export const authApp = app.auth();
