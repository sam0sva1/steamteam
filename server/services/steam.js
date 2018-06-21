// const fetching = require('../modules').fetching;
import { fetcher } from '../modules';


const methods = {};

const baseUrl = 'http://api.steampowered.com';

methods.getUserByName = async (name, key) => {
    return await fetcher(`${baseUrl}/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${name}`);
};

methods.getPlayerDetails = async (id, key) => {
    return await fetcher(`${baseUrl}/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${id}`);
}

methods.getGamesListById = async (id, key) => {
    return await fetcher(`${baseUrl}/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&include_appinfo=1`);
}

export default methods;
