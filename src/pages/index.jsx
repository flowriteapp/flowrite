import React, { useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';

import { withFirebase } from '../components/with-firebase';


function Auth(props) {
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const history = useHistory();

  const { firebase } = props;

  if (firebase.auth.currentUser) {
    history.push('/docs');
  }

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    await props.firebase.doSignInWithEmailAndPassword(emailLogin, passwordLogin);
    history.push('/docs');
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    await props.firebase.doCreateUserWithEmailAndPassword(emailRegister, passwordRegister);
    history.push('/docs');
  };

  return (
    <div>
      <form onSubmit={onSubmitLogin}>
        <input type="email" onChange={(e) => setEmailLogin(e.target.value)} />
        <input type="password" onChange={(e) => setPasswordLogin(e.target.value)} />
        <input type="submit" value="login" />
      </form>
      <form onSubmit={onSubmitRegister}>
        <input type="email" onChange={(e) => setEmailRegister(e.target.value)} />
        <input type="password" onChange={(e) => setPasswordRegister(e.target.value)} />
        <input type="submit" value="signup" />
      </form>
    </div>
  );
}

export default withRouter(withFirebase(Auth));
