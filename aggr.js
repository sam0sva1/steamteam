const fs = require('fs');
const request = require('request-promise-native');

const lists = require('./users');


const fetcher = (url) => {
    console.log('[GET] =>', url);
    return request({
        url: url,
        gzip: true,
        followRedirect: true,
        transform: (data, response) => {
            console.log('Status', response.statusCode);
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
    return await fetcher(`${baseUrl}/api.php?request=top100forever`);
};

const getTop100Forever = async (id) => {
    return await fetcher(`${baseUrl}/api.php?request=top100forever`);
};

const getTop100In2Weeks = async (id) => {
    return await fetcher(`${baseUrl}/api.php?request=top100in2weeks`);
};

const getTop100Owners = async (id) => {
    return await fetcher(`${baseUrl}/api.php?request=top100owned`);
};

const reqs = [getTop100Forever, getTop100In2Weeks, getTop100Owners];




const mainList = [];
const listFilter = (id) => {
    const numId = parseInt(id, 10);
    if (mainList.indexOf(numId) === -1) {
        mainList.push(numId);
    }
}

const iter = (res) => {
    Object.keys(res).forEach((id) => {
        listFilter(id);
    });
};

lists.forEach(list => {
    list.response.games.forEach(game => {
        listFilter(game.appid);
    });
    console.log('mainList len', mainList.length);
});

async function Getter() {
    const foreverPromise = getTop100Forever();
    await Sleep();
    const weeksPromise = getTop100In2Weeks();

    const forever = await foreverPromise;
    const weeks = await weeksPromise;
    iter(forever);
    iter(weeks);

    console.log('mainList len', mainList.length);

    const sorted = mainList.sort(((a, b) => a - b));
    fs.writeFileSync('./forcache.json', JSON.stringify(sorted, null, '    '));
}

Getter();
