import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import { withFirebase } from '../components/with-firebase';


function Auth(props) {
  const { firebase } = props;
  const [user, initialising, err] = useAuthState(firebase.auth());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push('/docs');
    }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (register) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        history.push('/docs');
      } catch (er) {
        if (er.code === 'auth/email-already-in-use') {
          setError('You already have an account, please click the sign in button below!');
        } else {
          setError(er.message);
        }
      }
    } else {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        history.push('/docs');
      } catch (er) {
        setError(er.message);
      }
    }
  };

  if (initialising) {
    return (
      <section className="section is-medium">
        <div className="columns has-text-centered is-vcentered">
          <div className="column is-12">
            <p className="is-size-3">loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="section is-medium">
        <div className="columns has-text-centered is-vcentered">
          <div className="column is-12">
            <p className="is-size-3">Error: {err}</p>
          </div>
        </div>
      </section>
    );
  }

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
                { error ? (<p className="has-text-danger is-uppercase">{ error } <br /><br /></p>) : null}
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
                    <a href={null} className="login has-text-link" role="button" onClick={() => setRegister(false)}>Already a member? Click here.</a>
                  ) : (
                    <a href={null} className="login has-text-link" role="button" onClick={() => setRegister(true)}>Need to make an account? Click here.</a>
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
