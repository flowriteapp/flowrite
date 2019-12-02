export function html(d) {
  const split = d.split(' ');
  if (split.length <= 2) {
    return `<span class="has-text-black">${split.join(' ')}</span>`;
  }
  const end = [split.pop(), split.pop()].reverse();
  return `<span class="has-text-white">${split.join(' ')}</span> <span class="has-text-black">${end.join(' ')}</span>`;
}

export function createDocument(docStorage, setDocStorage) { // eslint-disable-line
  setDocStorage([...docStorage, '']);
  return docStorage.length - 1;
}

export function deleteDocument(id, docStorage, setDocStorage) {
  setDocStorage(docStorage.filter((x, i) => i !== id));
}

export function getDocument(id, docStorage) {
  return docStorage[id];
}

export function getName(id, docStorage) {
  const doc = getDocument(id, docStorage);
  let str = doc.split('\n')[0].trim();
  if (!str || str === '&nbsp') {
    str = 'empty document';
  }
  return str;
}

export function getDocuments(docStorage) {
  return docStorage;
}

export function updateDocument(id, docStorage, setDocStorage) {
  return (document) => {
    setDocStorage(docStorage.map((val, index) => {
      if (id === index) {
        return document;
      }
      return val;
    }));
  };
}
