import firebase from 'firebase';
import * as config from './config.json';

firebase.initializeApp({
  apiKey: config.fbAPIkey,
  authDomain: 'clone-2fb44.firebaseapp.com',
  databaseURL: 'https://clone-2fb44.firebaseio.com',
  projectId: 'clone-2fb44',
  storageBucket: 'clone-2fb44.appspot.com',
  messagingSenderId: '453179319812',
  appId: '1:453179319812:web:f595b186ac1fe325de7751',
  measurementId: 'G-ZYQ93RJMX5',
});

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
