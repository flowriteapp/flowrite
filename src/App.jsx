/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import 'bulma/css/bulma.css';
import './styles/App.css';
import ls from 'local-storage';

function DocumentEditor({ document, updateDocument, vanishDisabled }) {
  const docRef = useRef(null);

  const handleChange = () => {
    updateDocument(docRef.current.innerText.trimLeft());
  };

  const html = (d, vanish) => {
    const len = 10;
    if (d.length < len) {
      return `<span class="has-text-black">${d}</span>`;
    }
    if(!(vanish)){
      return `<span class="has-text-white">${d.substring(0, d.length - len + 1)}</span><span class="has-text-black">${d.substring(d.length - len + 1, d.length)}</span>`;
    }else{
      return `<span class="has-text-black">${d}</span>`;
    }
  };

  return (
    <div className="panel container" style={{ padding: '1.5rem 1.5rem' }}>
      <ContentEditable
        innerRef={docRef}
        html={html(document, vanishDisabled) || '&nbsp;'}
        style={{ outline: '0px solid transparent', whiteSpace: 'pre-wrap' }}
        disabled={false}
        onChange={handleChange}
        tagName="doc-editor"
      />
    </div>
  );
}


function App() {
  // key == value in local storage
  function useLocalStorage(key, initialValue) {
    const [storedValue, setStorageValue] = useState(() => {
      try {
        const item = ls(key);
        return item != null ? item : initialValue;
      } catch (e) { return initialValue; }
    });

    const setValue = (value) => {
      try {
        setStorageValue(value);
        ls(key, value);
      } catch (e) {
        // do something with error
      }
    };
    return [storedValue, setValue];
  }
  const [docStorage, setDocStorage] = useLocalStorage('doclist', ['hi', 'hello']);
  const [selectedDocument, selectDocument] = useState(0);

  function createDocument() { // eslint-disable-line
    setDocStorage([...docStorage, '']);
    return docStorage.length - 1;
  }

  function getDocument(id) {
    return docStorage[id];
  }

  function getDocuments() {
    return docStorage;
  }

  function updateDocument(id) {
    return (document) => {
      setDocStorage(docStorage.map((val, index) => {
        if (id === index) {
          return document;
        }
        return val;
      }));
    };
  }
  let disableVanish = 1;
  let toggleText = "Disable Vanish";
  function toggleVanish () {
    disableVanish = disableVanish === 0 ? 1 : 0;
    toggleText = disableVanish === 0 ? toggleText : "Enable Vanish";
  }

  return (
    <section className="section App container">
      <div className="columns">
        <div className="column is-one-quarter">
            <button 
              className="button is-small"
              onClick={toggleVanish()}> 
              {toggleText}
            </button>
          <nav className="panel">
            <p className="panel-heading has-text-centered">
              documents
            </p>
            { getDocuments().map((doc, index) => {
              let str = doc.split('\n')[0].trim();
              let newDoc = false;
              if (!str || str === '&nbsp') {
                str = 'empty document';
                newDoc = true;
              }
              return (
                <a
                  className={classnames('panel-block', { 'has-text-grey': newDoc, 'bg-black': index === selectedDocument })}
                  onClick={() => selectDocument(index)}
                  style={{ wordBreak: 'break-word' }}
                  role="navigation"
                  key={index}
                >
                  {ls('doclist') != null ? ls('doclist')[index] : str}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="column">
          <DocumentEditor
            document={getDocument(selectedDocument)}
            updateDocument={updateDocument(selectedDocument)}
            vanishDisabled = {disableVanish}
          />
        </div>
      </div>
    </section>
  );
}

export default App;
