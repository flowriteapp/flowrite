/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
/* global window */
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import ls from 'local-storage';
import {
  useHistory, withRouter,
} from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';

import { join } from 'path';
import {
  Document, Packer, Paragraph, TextRun,

} from 'docx';

import { withFirebase } from '../components/with-firebase';

function DocumentEditor({ document, updateDocument }) {
  const docRef = useRef(null);
  const [fading, setFading] = useState(true);

  const handleChange = () => {
    updateDocument(docRef.current.innerText.trimLeft());
  };

  const html = (d) => {
    if (!d) {
      return '';
    }

    if (fading) {
      const split = d.split(' ');
      if (split.length <= 2) {
        return `<span class="has-text-black">${split.join(' ')}</span>`;
      }
      const end = [split.pop(), split.pop()].reverse();
      return `<span class="has-text-white">${split.join(' ')}</span> <span class="has-text-black">${end.join(' ')}</span>`;
    }

    return `<span class="has-text-black">${d}</span>`;
  };

  return (
    <div>
      <div className="panel container" style={{ padding: '1.5rem 1.5rem' }}>
        <ContentEditable
          innerRef={docRef}
          html={html(document) || '&nbsp;'}
          style={{ outline: '0px solid transparent', whiteSpace: 'pre-wrap' }}
          disabled={false}
          onChange={handleChange}
          tagName="doc-editor"
          spellcheck={!fading}
        />
      </div>
      <div className="container" style={{ paddingBottom: '1.5rem' }}>
        { fading ? (
          <button type="button" className="button is-dark" onClick={() => setFading(false)}>Fading On</button>
        ) : (
          <button type="button" className="button is-light" onClick={() => setFading(true)}>Fading Off</button>
        )}
      </div>
    </div>
  );
}

function App(props) {
  const history = useHistory();
  const { firebase } = props;

  const [user, initialising, error] = useAuthState(firebase.auth());

  let userId = 0;
  if (!user) {
    history.push('/');
  }

  function useLocalStorage(key, initialValue) {
    if (user) {
      userId = user.uid;
    }
    const [storedValue, setStorageValue] = useState(() => {
      try {
        const lsItem = ls(key);
        const fbItem = initialValue;
        const lsOrInit = lsItem !== null ? lsItem : initialValue;
        return fbItem !== null ? fbItem : lsOrInit;
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
        console.log(e); // eslint-disable-line
      }
    };
    return [storedValue, setValue];
  }

  const [docStorage, setDocStorage] = useLocalStorage('doclist', ['Welcome!']);
  const [synced, setSync] = useState(false);

  if (user && !synced) {
    const getFirebaseData = async () => {
      const docRef = await firebase.database().ref(`users/${userId}/documents`);
      const snap = await docRef.once('value');
      const fbItem = await snap.val();
      const documentSet = fbItem != null ? fbItem : docStorage;
      setDocStorage(documentSet);
      return documentSet;
    };
    getFirebaseData();
    setSync(true);
  }

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

  if (docStorage.length === 0) {
    createDocument();
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
            onClick={() => { const id = createDocument(); selectDocument(id + 1); }}
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
