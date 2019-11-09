/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
import React from 'react';
import 'bulma/css/bulma.css';
import './styles/App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Auth from './pages/index';
import Docs from './pages/docs';

function App() {
  return (
    <section className="section App container">
      <Router>
        <Switch>
          <Route path="/docs">
            <Docs />
          </Route>
          <Route path="/">
            <Auth />
          </Route>
        </Switch>
      </Router>
    </section>
  );
}

export default App;
