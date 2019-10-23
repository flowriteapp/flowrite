import React from 'react';
import './styles/App.css';

function App() {
  //storage for list of documents
  const [docStorage, setDocStorage] = React.useState(["This is one example",
      "This is another example", "Maybe this is another one"]);

  function createDocument(){
    setDocStorage([...docStorage, ""]);
    return docStorage.length - 1;
  }
  function updateDocument(document, id){
    setDocStorage(docStorage.map((val, index) => {
      if (id === index) {
        return document;
      }
      return val;
    }));
  }
  return (
    <div className="App">
      <div class="columns">
        <div class="column">1</div>
        <div class="column">2</div>
        <div class="column">3</div>
        <div class="column">4</div>
        <div class="column">5</div>
      </div>
    </div>
   
  );
}

export default App;



/*

function Document({document, index}) {
  const [words, setWords] = React.useState("");
  const [doc, setDoc] = useStateWithLocalStorage(index)
  const changeText = event => {
    setWords(event.target.value);
    document = document + words;
  }
  
  return (
    <div>
      <h2>Document</h2><p>{document}</p>
      <textarea 
        className="Document-textarea"
        value = {words}
        onChange={changeText}  
      />
    </div>
  );
}
function useStateWithLocalStorage(localStorageKey) {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ''
  );
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);
  return [value, setValue];
}

function createDocument(){

}
        <Document document={docStorage[i]} index = {i}/>
class Document extends React.Component{
  createDocument(){
    let words = []
    return(<button onClick={() => words}></button>);
  }
  updateDocument(document){

  }
  deleteDocument(document){

  }
  exportDocument(document){

  }
  render(){
    return(
      <div class="Doc-button">
        {this.createDocument()}
      </div>
    );
  }
}
*/

