import firebase from 'firebase/app';

const CONFIG = {
  apiKey: "AIzaSyCNpfWQkQiuWryP8gJV9XY2sXOKfqnb8G0",
  authDomain: "amemory-c53ee.firebaseapp.com",
  databaseURL: "https://amemory-c53ee.firebaseio.com",
  projectId: "amemory-c53ee",
  storageBucket: "amemory-c53ee.appspot.com",
  messagingSenderId: "415926222316"
};

firebase.initializeApp(CONFIG);

export default firebase;