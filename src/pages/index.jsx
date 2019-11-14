import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';

import { withFirebase } from '../components/with-firebase';


function Auth(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(true);
  const history = useHistory();

  const { firebase } = props;

  useEffect(() => {
    if (firebase && firebase.auth.currentUser) {
      history.push('/docs');
    }
  });


  const onSubmit = async (e) => {
    e.preventDefault();

    if (register) {
      await props.firebase.doCreateUserWithEmailAndPassword(email, password);
    } else {
      await props.firebase.doSignInWithEmailAndPassword(email, password);
    }

    history.push('/docs');
  };

  return (
    <div>
      <section className="section is-medium">
        <div className="columns is-desktop is-vcentered">
          <div className="column is-4 is-offset-one-third has-background-white">
            <div className="container is-fluid has-text-centered">
              <figure className="image is-96x96 is-inline-block">
                <img src="images/flowrite.jpg" alt="FloWrite logo" />
              </figure>
              <h1 className="title">Welcome to FloWrite</h1>
              <p className="subtitle is-6">
                    Journal without distractions
              </p>
              <form onSubmit={onSubmit}>
                <div className="field">
                  <div className="control">
                    <input className="input" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <input className="input" type="password" placeholder="Create a password" onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div className="buttons">
                  { register ? (
                    <button type="submit" className="button is-fullwidth is-link">Register</button>
                  ) : (
                    <button type="submit" className="button is-fullwidth is-link">Sign in</button>
                  )}
                </div>
                <p className="subtitle is-link is-6">
                  { register ? (
                    <a className="login has-text-link" role="signin" onClick={() => setRegister(false)}>Already a member? Click here.</a>
                  ) : (
                    <a className="login has-text-link" role="register" onClick={() => setRegister(true)}>Need to make an account? Click here.</a>
                  ) }
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default withFirebase(withRouter(Auth));
