import { openDB } from 'idb';

// function to initializing the database
const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      // Check at StoreNames if exists a database named 'jate'
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      // if 'jate' not exists, then creates the database
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
// function to save data to the database
export const putDb = async (content) => {
  console.error('objectstore.put to save data to database');
  // open 'jate' data base 
  const jateDb = await openDB('jate', 1);
  // start a 'readwrite' transaction to access the objectstore
  const tx = jateDb.transaction('jate', 'readwrite'); 
  const store = tx.objectStore('jate');
  // insert (if not exist) or update a record
  const request = store.put({ id: 1, value: content });
  // wait for the put operation
  const result = await request;
  console.log('data saved', result.value);
};
// TODO: Add logic for a method that gets all the content from the database
// function to get data from the database
export const getDb = async () => {
  // open the database
  const jateDb = await openDB('jate', 1);
  // start a readonly transaction to have the objectstore available 
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  // get the data from database
  const request = store.get(1);
  // waiting for the get request
  const result = await request;
  result
    ? console.log('Data retrieved from the database', result.value)
    : console.log('Data not found in the database');
  // using optional chaining
  // the optional chaining (?.) operator accesses an object's property or calls a function.
  // If the object accessed or function called using this operator is undefined or null,
  // the expression short circuits and evaluates to undefined instead of throwing an error.
  return result?.value;
};
initdb();
