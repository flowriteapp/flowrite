/* eslint-disable class-methods-use-this, react/prop-types, react/no-array-index-key */
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import ls from 'local-storage';
import { useHistory, withRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { useList } from 'react-firebase-hooks/database';

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


  if (!user) {
    history.push('/');
  }
  // let lsTimeStamp = 0;
  // let fbTimeStamp = 0;
  // key == value in local storage
  // includes firebase console.log("ERRCHECK");
  function useLocalStorage(key, initialValue) {
    const [storedValue, setStorageValue] = useState(() => {
      try {
        const lsItem = ls(key);
        let fbItem;
        // const [snapshots, loading, errorls] =
        //   useList(firebase.database().ref('users/' + user.uid));
        const usrpath = `users/${user.uid}`;
        firebase.database().ref(usrpath).on('value', (snapshot) => {
          const docPath = `users/${user.uid}/documents`;
          fbItem = snapshot.child(docPath).val();
          const timestampPath = `users/${user.uid}/timestamp`;
          // fbTimeStamp = snapshot.child(timestampPath).val();
        });
        const lsOrInit = lsItem != null ? lsItem : initialValue;
        return fbItem != null ? fbItem : lsOrInit;
      } catch (e) { return initialValue; }
    });

    const setValue = (value) => {
      try {
        // firebase.database().ref("users/" + user.uid);
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


  const [docStorage, setDocStorage] = useLocalStorage('doclist', ['hi', 'hello']);

  const [selectedDocument, selectDocument] = useState(0);

  function createDocument() { // eslint-disable-line
    setDocStorage([...docStorage, 'new document']);
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
            documents list view
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
