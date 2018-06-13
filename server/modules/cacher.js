import fs from 'fs';

import { SteamSpyService } from '../services';
import { Sleep } from '../modules';

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
      const file = fs.readFileSync(filePath);
      const list = JSON.parse(file);
      setStorage(list);

      console.log('===> Cache is ready!');
    } else {
      cacheWarming('./CacheData/forCache.json');
    }
  },
};

async function cacheGameList(list) {
  console.time('cacheGameList');
  const len = list.length;

  for (let i = 0; i < len; i += 1) {
      const id = list[i];
      const game = await SteamSpyService.getGameDetalesById(id);
      const sleep = Sleep();
      cacher.set(id, game);
      await sleep;
  }

  console.timeEnd('cacheGameList');
}

function saveCachedData(data) {
  if (!fs.existsSync('./cacheData')) {
    fs.mkdirSync('./cacheData');
  }

  fs.writeFileSync('./cacheData/cachec.json', JSON.stringify(data, null, '  '));
}

async function cacheWarming(listPath) {
  console.log('===> Start to warm up the cache!');
  let list;

  if (listPath && fs.existsSync(listPath)) {
    const file = fs.readFileSync(listPath);
    list = JSON.parse(file);
  } else {
    list = await SteamSpyService.getListOfTopGames();
  }

  await cacheGameList(list);
  saveCachedData(cacher.getStorage());
  console.log('===> Cache warm up finished!');
}

export default cacher;
