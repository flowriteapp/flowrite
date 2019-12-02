/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
/* global window */
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
import {
  Document, Packer, Paragraph, TextRun,

} from 'docx';

import { withFirebase } from '../components/with-firebase';

let spellcheck = false;
function DocumentEditor({ document, updateDocument }) {
  const docRef = useRef(null);

  const handleChange = () => {
    updateDocument(docRef.current.innerText.trimLeft());
  };

  const html = (d) => {
    const split = d.split(' ');
    if (split.length <= 2) {
      return `<span class="has-text-black">${split.join(' ')}</span>`;
    }
    const end = [split.pop(), split.pop()].reverse();
    return `<span class="has-text-white">${split.join(' ')}</span> <span class="has-text-black">${end.join(' ')}</span>`;
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
        spellCheck={spellcheck}
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
  function useLocalStorage(key, initialValue) {
    const [storedValue, setStorageValue] = useState(() => {
      try {
        const lsItem = ls(key);
        let fbItem;
        const usrpath = `users/${user.uid}`;
        firebase.database().ref(usrpath).on('value', (snapshot) => {
          const docPath = `users/${user.uid}/documents`;
          fbItem = snapshot.child(docPath).val();
        });
        const lsOrInit = lsItem != null ? lsItem : initialValue;
        return fbItem != null ? fbItem : lsOrInit;
      } catch (e) { return initialValue; }
    });

    const setValue = (value) => {
      try {
        const usrpath = `users/${user.uid}`;
        firebase.database().ref(usrpath).set({
          documents: value,
          timestamp: Date.now(),
        });

        setStorageValue(value);
        ls(key, value);
      } catch (e) {
        // handle e
      }
    };
    return [storedValue, setValue];
  }

  const [docStorage, setDocStorage] = useLocalStorage('doclist', ['Welcome!']);
  const [selectedDocument, selectDocument] = useState(0);
  
  

  function createDocument() { // eslint-disable-line
    setDocStorage([...docStorage, '']);
    return docStorage.length - 1;
  }

  function deleteDocument(id) {
    setDocStorage(docStorage.filter((x, i) => i !== id));
  }

  function getDocument(id) {
    return docStorage[id];
  }

  function getName(id) {
    const doc = getDocument(id);
    let str = doc.split('\n')[0].trim();
    if (!str || str === '&nbsp') {
      str = 'empty document';
    }
    return str;
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

  const exportTxt = (id) => {
    const electron = window.require('electron');
    const fs = window.require('fs');
    const homedir = electron.remote.app.getPath('home');
    const name = getName(id) || id;
    const path = join(homedir, `${name}.txt`);
    fs.writeFileSync(path, getDocument(id));
  };

  const exportDocx = (id) => {
    const electron = window.require('electron');
    const fs = window.require('fs');
    const homedir = electron.remote.app.getPath('home');
    const name = getName(id) || id;
    const path = join(homedir, `${name}.docx`);
    const doc = new Document();
    const lines = getDocument(id).split('\n');
    doc.addSection({
      properties: {},
      children: lines.map((line) => (new Paragraph({
        children: [
          new TextRun(line),
        ],
      }))),
    });
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(path, buffer);
    });
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
                className={classnames('panel-block is-fullwidth', { 'has-text-grey': newDoc, 'bg-black': index === selectedDocument })}
                onClick={() => selectDocument(index)}
                style={{ wordBreak: 'break-word' }}
                role="button"
                key={index}
                
              >
                
                <span style={{ flexGrow: '1' }}>{ str }</span>
                <div className="has-text-danger" onClick={() => deleteDocument(index)}>x</div>
              </a>
            );
          })}
          <a
            href={null}
            className="panel-block has-background-success has-text-white"
            role="button"
            onClick={() => { const id = createDocument(); selectDocument(id); }}
          >
              new document
          </a>
          <a
            className="panel-block has-background-primary has-text-white"
            role="navigation"
            onClick={() => {spellcheck = !spellcheck}}
          >
              toggle spellcheck
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
            className="panel-block"
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
        <button type="button" className="button is-medium has-text-justified" onClick={() => exportTxt(selectedDocument)}>Export TXT</button>
        <button type="button" className="button is-medium has-text-justified" onClick={() => exportDocx(selectedDocument)}>Export DOCX</button>
      </div>
    </div>
  );
}

export default withRouter(withFirebase(App));

