import fs from 'fs';
import path from 'path';

import { SteamSpyService } from '../services';
import { saveCachedData } from '../modules';
import queue from '../modules/queue';

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
  init: (initFunc) => {
    if (!initFunc || typeof initFunc !== 'function') {
      console.log('===> Cache started empty!');
      console.log('initFunc is not correct function.');
      return;
    }

    initFunc(setStorage);
  },
  save: (filePath = './cacheData') => {
    if (filePath && !fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    fs.writeFileSync(path.resolve(filePath, 'cached.json'), JSON.stringify(cacheStorage, null, '  '));
    console.log('===> Cache was saved!');
  },
};

export default cacher;
