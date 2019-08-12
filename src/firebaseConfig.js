import firebase from 'firebase';
import 'firebase/firestore';
import firebaseui from 'firebaseui';

// firebase init goes here
const config = {
  apiKey: 'AIzaSyBfXzYv-T2dUpDDCWgpST_eF_MuQWYzZFc',
  authDomain: 'vuexeasyfirestoretroubleshoot.firebaseapp.com',
  databaseURL: 'https://vuexeasyfirestoretroubleshoot.firebaseio.com',
  projectId: 'vuexeasyfirestoretroubleshoot',
  storageBucket: 'vuexeasyfirestoretroubleshoot.appspot.com',
  messagingSenderId: '1028085654256',
  appId: '1:1028085654256:web:703890a57ebfa87d'
};
function initFirebase() {
  firebase.initializeApp(config);
  return new Promise((resolve, reject) => {
    //   firebase
    //     .firestore()
    //     .enablePersistence({ synchronizeTabs: true })
    //     .then(resolve)
    //     .catch(err => {
    //       if (err.code === 'failed-precondition') {
    //         reject(err);
    //         // Multiple tabs open, persistence can only be
    //         // enabled in one tab at a a time.
    //       } else if (err.code === 'unimplemented') {
    //         reject(err);
    //         // The current browser does not support all of
    //         // the features required to enable persistence
    //       }
    //     });
    resolve;
  });
}

// initFirebase
initFirebase().catch(error => {
  console.log('error initializing firebase', error);
});

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const providerIds = firebase.auth;
const storage = firebase.storage();
const { currentUser } = auth;
const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
const timestamp = firebase.firestore.Timestamp;
const array = {
  union: item => firebase.firestore.FieldValue.arrayUnion(item),
  remove: item => firebase.firestore.FieldValue.arrayRemove(item)
};
const FieldValue = firebase.firestore.FieldValue;
const firestore = firebase.firestore;
// date issue fix according to firebase
// const settings = {
//   timestampsInSnapshots: true
// };
// db.settings(settings);

// firebase collections
const testCollection = db.collection('test');
const usersCollection = db.collection('users');

const fb = {
  firebase,
  db,
  storage,
  firestore,
  firebaseui,
  providerIds,
  util: {
    serverTimeStamp,
    timestamp,
    array,
    FieldValue
  },
  auth,
  paths: {
    function: 'https://us-central1-masterDoc-195220.cloudfunctions.net/',
    functionLocal: 'http://localhost:5000/masterDoc-195220/us-central1/'
  },
  currentUser,
  testCollection,
  usersCollection
};

export default fb;
