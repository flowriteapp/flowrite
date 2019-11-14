import React from 'react';
import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyChh73lN4WCmHebNppsKQ4oSi_icoYm71o',
  authDomain: 'flowriteapp.firebaseapp.com',
  databaseURL: 'https://flowriteapp.firebaseio.com',
  projectId: 'flowriteapp',
  storageBucket: 'flowriteapp.appspot.com',
  messagingSenderId: '494871235695',
  appId: '1:494871235695:web:34eb0bdc7b63bc663e519a',
  measurementId: 'G-L5LML9BZ6Y',
};

app.initializeApp(config);
// class Firebase {
//   constructor() {
//     this.app = app;
//     this.auth = app.auth();
//   }

//   doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

//   doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

//   doSignOut = () => this.auth.signOut();

//   doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

//   doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);
// }


const FirebaseContext = React.createContext(null);

export default app;
export { FirebaseContext };
