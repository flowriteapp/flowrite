import React from 'react';

import { FirebaseContext } from './firebase';

export const withFirebase = (Component) => (props) => (
  <FirebaseContext.Consumer>
    {(firebase) => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
export default FirebaseContext;
