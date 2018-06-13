import { fetcher, Sleep } from '../modules';


const methods = {};

const baseUrl = 'http://steamspy.com';

const getGameDetalesById = async (id) => {
    return await fetcher(`${baseUrl}/api.php?request=appdetails&appid=${id}`);
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

const gameList = [];

const listFilter = (id) => {
    const numId = parseInt(id, 10);
    if (gameList.indexOf(numId) === -1) {
        gameList.push(numId);
    }
};

const iter = (res) => {
    Object.keys(res).forEach((id) => {
        listFilter(id);
    });
};

const getListOfTopGames = async () => {
    const foreverPromise = getTop100Forever();
    await Sleep();
    const TwoWeeksPromise = getTop100In2Weeks();
    await Sleep();
    const byOwnersPromise = getTop100Owners();

    const topForever = await foreverPromise;
    iter(topForever);
    const top2Weeks = await TwoWeeksPromise;
    iter(top2Weeks);
    const topByOwners = await byOwnersPromise;
    iter(topByOwners);

    const sorted = gameList.sort(((a, b) => a - b));

    return sorted;
}

export default {
    getGameDetalesById,
    getTop100Forever,
    getTop100In2Weeks,
    getTop100Owners,
    getListOfTopGames,
};
