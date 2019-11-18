/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import ls from 'local-storage';
import { useHistory, withRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

import { withFirebase } from '../components/with-firebase';

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

  
  // uListReference.set({
  //   'uid' : '' + user.uid,
  //   'documents' : docStorage
  // });
  
  
  
  //const [snapshots, loading, errorls] = useList(uListReference);

  if (!user) {
    history.push('/');
  }

  // key == value in local storage
  //includes firebase
  function useLocalStorage(key, initialValue) {
    const [storedValue, setStorageValue] = useState(() => {
      try {
        const lsItem = ls(key);
        let fbUserRef = firebase.database().ref("users/" + user.uid);
        let fbItem;
        fbUserRef.once('value', function(snap){
          fbItem = snap.val();
        });
        
        return lsItem != null ? lsItem : initialValue;
      } catch (e) { return initialValue; }
    });

    const setValue = (value) => {
      try {
        //firebase.database().ref("users/" + user.uid);
        firebase.database().ref('users/' + user.uid).set({
          'documents' : value
        });
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
            documents {}
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
          <a
            className="panel-block has-background-success has-text-white"
            role="navigation"
            onClick={createDocument}
          >
              new document
          </a>
          <a
            className="panel-block has-background-danger has-text-white"
            role="navigation"
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
      </div>
    </div>
  );
}

export default withRouter(withFirebase(App));
