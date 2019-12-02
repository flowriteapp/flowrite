// import React from 'react';
import renderer from 'react-test-renderer';
import {
  html,
  createDocument,
  deleteDocument,
  getDocument,
  getName,
  getDocuments,
  updateDocument,
} from '../__mock__/docs';

it('makes text disappear properly', () => {
  const htmlExpected = {
    one: '<span class="has-text-black">hello</span>',
    two: '<span class="has-text-black">hello world</span>',
    three: '<span class="has-text-white">hello</span> <span class="has-text-black">world hi</span>',
    fours: '<span class="has-text-white">hello world</span> <span class="has-text-black">hi there</span>',
  };

  const htmlOneWord = html('hello');
  expect(htmlOneWord).toBe(htmlExpected.one);

  const htmlTwoWord = html('hello world');
  expect(htmlTwoWord).toBe(htmlExpected.two);

  const htmlThreeWord = html('hello world hi');
  expect(htmlThreeWord).toBe(htmlExpected.three);

  const htmlFourWords = html('hello world hi there');
  expect(htmlFourWords).toBe(htmlExpected.fours);
});

var docStorage = ['Welcome!'];
const setDocStorage = (value) => {
  docStorage = value;
};

describe('document manipulation', () => {
  it('creates a document', () => {
    createDocument(docStorage, setDocStorage);
    expect(docStorage.length).toBe(2);
    expect(docStorage[1]).toBe('');
  });

  it('deletes a document', () => {
    deleteDocument(1, docStorage, setDocStorage);
    expect(docStorage.length).toBe(1);
    expect(docStorage[1]).toBe(undefined);
  });

  it('gets a document', () => {
    const doc = getDocument(0, docStorage);
    expect(doc).toBe('Welcome!');
  });

  it('gets a name', () => {
    const name = getName(0, docStorage);
    expect(name).toBe('Welcome!');
  });

  it('gets all documents', () => {
    const docs = getDocuments(docStorage);
    console.log(docs);
    expect(docs).toEqual(['Welcome!']);
  });

  const newDoc = "hello my dear friend how are you?\nlook at tinku's son";

  it('updates a document', () => {
    updateDocument(0, docStorage, setDocStorage)(newDoc);
    expect(docStorage[0]).toBe(newDoc);
  });

  it('gets updated document', () => {
    const doc = getDocument(0, docStorage);
    expect(doc).toBe(newDoc);
  });

  it('gets updated name', () => {
    const name = getName(0, docStorage);
    expect(name).toBe('hello my dear friend how are you?');
  });

  it('creates a new document and updates it', () => {
    const id = 1;
    updateDocument(0, docStorage, setDocStorage)('Welcome!');

    createDocument(docStorage, setDocStorage);
    expect(docStorage.length).toBe(2);
    expect(docStorage[id]).toBe('');

    updateDocument(id, docStorage, setDocStorage)(newDoc);
    expect(docStorage[id]).toBe(newDoc);

    const doc = getDocument(id, docStorage);
    expect(doc).toBe(newDoc);

    const name = getName(id, docStorage);
    expect(name).toBe('hello my dear friend how are you?');

    const shouldBe = ['Welcome!', newDoc];
    const docs = getDocuments(docStorage);
    expect(docs).toEqual(shouldBe);
  });
});
