/* eslint-disable class-methods-use-this */
import React from 'react';
import 'bulma/css/bulma.css';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <div className="columns">
        <div className="column has-background-primary">
          First
        </div>
        <div className="column">

          <div className="button">this is a button</div>
        </div>
        <div className="column has-background-primary">
          Third
        </div>
        <div className="column has-background-primary">
          Fourth
        </div>
      </div>
      <Document className="test" />
    </div>
  );
}

class Document extends React.Component {
  createDocument() {

  }

  updateDocument() {

  }

  deleteDocument() {

  }

  saveDocument() {

  }

  exportDocument() {

  }

  render() {
    return (
      <div className="docMain">
        <p>DOCTEST</p>
      </div>
    );
  }
}

export default App;
