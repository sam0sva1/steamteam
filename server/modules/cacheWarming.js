import queue from './queue';
import cacher from './cacher';

async function cacheGameList(list) {
    console.time('cacheGameList');

    await Promise.all(list.map((id) => {
        return new Promise((resolve, reject) => {
            queue(id, resolve);
        });
    }));

    console.timeEnd('cacheGameList');
}

async function cacheWarming(listPath) {
    console.log('===> Start to warm up the cache!');
    let list;

    if (listPath && fs.existsSync(listPath)) {
        const file = fs.readFileSync(listPath);
        list = JSON.parse(file);
    } else {
        try {
        list = await SteamSpyService.getListOfTopGames();
        } catch (err) {
        console.log('===> CacheWarming failed!');
        console.error('Error', err);
        }
    }

    await cacheGameList(list);
    cacher.save();
    console.log('===> Cache warm up finished!');
}

export default cacheWarming;
