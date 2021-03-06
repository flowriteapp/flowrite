 ### DISCLAIMER: Firebase module is unable to be tested due to lack of support for mocking Firebase.

## Modules tested:


Making sure the text disappears correctly
- For one or two words, the entire text should still be black.
- For more than two words, only the last two words should be black. The others should be white.
- This was tested using dummy strings to simulate each possibility.

Creating a document
- Function creates a document and saves it properly

Deleting a document
- Function deletes an existing document and change is propagated

Getting a document
- Function gets the right document specified

Getting a name for a document
- Function gets the correct name for the document specified

Getting all documents
- Function gets correct list of documents with all items and no extra items

Updating a document
- Function changes the text of the specified document and only the specified document

Getting an updated document
- Function properly gets the changed content

Getting the name of an updated document
- Function properly gets the name based on the changed content

Creating a new document, updating it, verifying the changes propagated
- Creation of document proceeded correctly
- Updating the new document propagated correctly
- Getting the contents of the updated document resulted in a successful update
- Getting the name of the updated document resulted in success
- Getting all documents resulted in a proper list of documents with the updated document
