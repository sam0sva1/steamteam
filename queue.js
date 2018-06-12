const fs = require('fs');
const request = require('request-promise-native');
const cacher = require('./server/modules/cacher');

const file = fs.readFileSync('./forcache.json');
const listOfId = JSON.parse(file);


const fetcher = (url) => {
    return request({
        url: url,
        gzip: true,
        followRedirect: true,
        transform: (data, response) => {
            console.log('[GET] =>', url, 'Status', response.statusCode);
            return JSON.parse(data);
        },
    });
};

const Sleep = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('sleep Started!');
            resolve();
        }, 250);
    });
}

const baseUrl = 'http://steamspy.com';

const getDetalesById = async (id) => {
    return await fetcher(`${baseUrl}/api.php?request=appdetails&appid=${id}`);
};


async function cacheWarming(list) {
    console.time('cacheWarming');
    const len = list.length;

    for (let i = 0; i < len; i += 1) {
        const id = list[i];
        const game = await getDetalesById(id);
        const sleep = Sleep();
        cacher.set(id, game);
        await sleep;
    }

    fs.writeFileSync('./cacheData/cached.json', JSON.stringify(cacher.getStorage(), null, '    '));
    console.timeEnd('cacheWarming');
}

queue(listOfId);