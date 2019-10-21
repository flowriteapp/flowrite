import React from 'react';
<<<<<<< HEAD
import logo from './logo.svg';
import 'bulma';
=======
>>>>>>> a98b3c52052cf82051fc6f2c3666a1671c500fca
import './App.css';

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br />
        <div className="columns">
          <div className="column has-background-primary">
            First
          </div>
          <div className="column has-background-primary">
            Second
          </div>
          <div className="column has-background-primary">
            Third
          </div>
          <div className="column has-background-primary">
            Fourth
          </div>
        </div>
      </header>
=======
      <Document className="test"> </Document>
>>>>>>> a98b3c52052cf82051fc6f2c3666a1671c500fca
    </div>
  );
}

class Document extends React.Component{
  createDocument(){

  }
  updateDocument(){

  }
  deleteDocument(){

  }
  saveDocument(){

  }
  exportDocument(){
    
  }
  render(){
    return(
      <div className="docMain">
        <p>DOCTEST</p>
      </div>
    );
  }
}

export default App;
