import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAx3Y8W3wh2BNaY0xmm8JELD1LFhhIhq7g",
  authDomain: "todolist-fullstack-a6330.firebaseapp.com",
  databaseURL: "https://todolist-fullstack-a6330.firebaseio.com",
  projectId: "todolist-fullstack-a6330",
  storageBucket: "todolist-fullstack-a6330.appspot.com",
  messagingSenderId: "978765720471",
  appId: "1:978765720471:web:bf10a4ecd81609cee1f2d2"
});

export { firebaseConfig as firebase };
