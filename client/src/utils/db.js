const DB_NAME = 'NoterDB';
const DB_VERSION = 1;
const STORES = {
  NOTES: 'notes',
  TASKS: 'tasks'
};

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject('IndexedDB error: ' + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.NOTES)) {
        db.createObjectStore(STORES.NOTES, { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        db.createObjectStore(STORES.TASKS, { keyPath: '_id' });
      }
    };
  });
};

export const saveToDB = async (storeName, data) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  
  if (Array.isArray(data)) {
    data.forEach(item => store.put(item));
  } else {
    store.put(data);
  }
  
  return tx.complete;
};

export const getFromDB = async (storeName) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};
