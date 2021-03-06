import React from 'react';
import ReactDOM from 'react-dom';
import Firebase, { FirebaseContext } from './components/firebase';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';
import App from './App';

ReactDOM.render(
  <FirebaseContext.Provider value={Firebase}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
