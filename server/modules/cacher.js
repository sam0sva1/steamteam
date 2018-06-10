const cacheStorage = {};

const cacher = {
  get: (name = '') => cacheStorage[name],
  set: (name = '', value = null) => {
    cacheStorage[name] = value;
    return true;
  },
  delete: (name = '') => delete cacheStorage[name],
  list: () => Object.keys(cacheStorage),
};

export default cacher;
