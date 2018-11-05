import firebase from 'firebase';
import {FIREBASE_CONFIG} from '../../app.config'


firebase.initializeApp(FIREBASE_CONFIG);


const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});


export {firebase, db};