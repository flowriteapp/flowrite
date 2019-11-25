/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import { withFirebase } from '../components/with-firebase';

import logo from '../logo.png';


function App(props) {
  const history = useHistory();
  const { firebase } = props;

  const [user, initialising, error] = useAuthState(firebase.auth());

  if (!user) {
    history.push('/');
  }

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

  if (error) {
    return (
      <section className="section is-medium">
        <div className="columns has-text-centered is-vcentered">
          <div className="column is-12">
            <p className="is-size-3">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container is-fluid">
        <div className="is-fullwidth has-text-centered">
          <figure className="image" style={{ width: '512px', marginLeft: 'auto', marginRight: 'auto' }}>
            <img src={logo} alt="FloWrite logo" />
          </figure>
        </div>
        <div className="columns has-text-centered">
          <div className="column  has-text-centered">
            <h1 className="title is-1">Settings</h1>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column has-text-centered">
          <h1 className="subtitle">
            <a className="has-text-black">Profile</a>
          </h1>
          <h1 className="subtitle">
            <a className="has-text-black">Fading</a>
          </h1>
          <h1 className="subtitle">
            <a className="has-text-black">Export</a>
          </h1>
          <h1 className="subtitle"><a className="has-text-black">Colors</a></h1>
          <h1 className="subtitle"><a className="has-text-black">Sign Out</a></h1>
        </div>
      </div>
    </section>
  );
}

export default withRouter(withFirebase(App));
