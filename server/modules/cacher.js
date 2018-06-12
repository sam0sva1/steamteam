import fs from 'fs';
let cacheStorage = {};

const setStorage = (storage) => cacheStorage = storage;

const cacher = {
  get: (name = '') => cacheStorage[name],
  set: (name = '', value = null) => {
    cacheStorage[name] = value;
    return true;
  },
  delete: (name = '') => delete cacheStorage[name],
  list: () => Object.keys(cacheStorage),
  getStorage: () => cacheStorage,
  setStorage,
  init: (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      const file = fs.readFileSync('./cached.json');
    const list = JSON.parse(file);
    setStorage(list);
    } else {
      console.log('NO CACHED!!')
    }
  },
};

export default cacher;
