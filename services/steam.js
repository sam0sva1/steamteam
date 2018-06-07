const fetching = require('../modules').fetching;


const methods = {};

const baseUrl = 'http://api.steampowered.com';

methods.getIdByName = async (name, key) => {
    return await fetching(`${baseUrl}/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${name}`);
};

methods.getGamesListById = async (id, key) => {
    return await fetching(`${baseUrl}/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}`);
}

module.exports = methods;