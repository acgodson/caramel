import { initializeApp } from "firebase/app";
import "firebase/auth";

//keys are exposed for testing period
const firebaseConfig = {
    apiKey: "AIzaSyAM5msm1T2lAgyBsNlFdsnhUP5s3q4y1CY",
    authDomain: "caramelplugin.firebaseapp.com",
    projectId: "caramelplugin",
    storageBucket: "caramelplugin.appspot.com",
    messagingSenderId: "22517836829",
    appId: "1:22517836829:web:8a9e3c263052ad6e9d2af4",
    measurementId: "G-X2RTSDBHRJ"
};


export function initFirebase() {
    initializeApp(firebaseConfig);
}

