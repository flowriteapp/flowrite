import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Document className="test"> </Document>
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
