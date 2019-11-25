/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import ls from 'local-storage';
import {
  useHistory, withRouter,
  Link,
} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { join } from 'path';


import { withFirebase } from '../components/with-firebase';

const exportTxt = (id) => {
    const electron = window.require('electron');
    const fs = window.require('fs');
    const homedir = electron.remote.app.getPath('home');
    const path = join(homedir, '${id}.txt');
    fs.writeFileSync(path,getDocument(id));
};

function DocumentEditor({ document, updateDocument }) {
  const docRef = useRef(null);

  const handleChange = () => {
    updateDocument(docRef.current.innerText.trimLeft());
  };

  const html = (d) => {
    const len = 10;
    if (d.length < len) {
      return `<span class="has-text-black">${d}</span>`;
    }
    return `<span class="has-text-white">${d.substring(0, d.length - len + 1)}</span><span class="has-text-black">${d.substring(d.length - len + 1, d.length)}</span>`;
  };

  return (
    <div className="panel container" style={{ padding: '1.5rem 1.5rem' }}>
      <ContentEditable
        innerRef={docRef}
        html={html(document) || '&nbsp;'}
        style={{ outline: '0px solid transparent', whiteSpace: 'pre-wrap' }}
        disabled={false}
        onChange={handleChange}
        tagName="doc-editor"
      />
    </div>
  );
}


function App(props) {
  const history = useHistory();
  const { firebase } = props;

  const [user, initialising, error] = useAuthState(firebase.auth());

  if (!user) {
    history.push('/');
  }

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
    setDocStorage([...docStorage, 'asdf']);
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

  if (initialising) {
    return (
      <section className="section is-medium">
        <div className="columns has-text-centered is-vcentered">
          <div className="column is-12">
            <p className="is-size-3">loading...</p>
            <button className="button is-medium has-text-justified" onclick={()=>exportTxt(selectedDocument)}>Export TXT</button>
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
    <div className="columns">
      <div className="column is-one-quarter">
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
                href={null}
                className={classnames('panel-block', { 'has-text-grey': newDoc, 'bg-black': index === selectedDocument })}
                onClick={() => selectDocument(index)}
                style={{ wordBreak: 'break-word' }}
                role="button"
                key={index}
              >
                {ls('doclist') != null ? ls('doclist')[index] : str}
              </a>
            );
          })}
          <a
            href={null}
            className="panel-block has-background-success has-text-white"
            role="button"
            onClick={createDocument}
          >
              new document
          </a>
          <a
            href={null}
            className="panel-block has-background-danger has-text-white"
            role="button"
            onClick={async () => {
              await firebase.auth().signOut();
              history.push('/');
            }}
          >
              sign out
          </a>
          <Link
            to="/settings"
            className="panel-block has-background-success has-text-white"
            role="button"
          >
              settings
          </Link>
        </nav>
      </div>
      <div className="column">
        <DocumentEditor
          document={getDocument(selectedDocument)}
          updateDocument={updateDocument(selectedDocument)}
        />
      </div>
    </div>
  );
}

export default withRouter(withFirebase(App));
