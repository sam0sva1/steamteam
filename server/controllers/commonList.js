import { SteamService, SteamSpyService } from '../services';
import { compare, Cacher, Sleep} from '../modules';

let sleep;
async function getGameDetails(id) {
    await sleep;
    const gameDetaild = await SteamSpyService.getGameDetalesById(id);
    sleep = Sleep();
    Cacher.set(id, gameDetaild);
    return gameDetaild;
}

const commonList = async ctx => {
    const { user_ids } = ctx.query;
    if (user_ids) {
        const ids = user_ids.split(',');
        const lists = await Promise.all(ids.map(id => SteamService.getGamesListById(id, ctx.config.steam_key)));
        const commonGames = compare(lists);

        if (!commonGames) {
            ctx.status = 200;
            return;
        }

        const multiplayerGames = [];
        const gamesAmount = commonGames.length;

        for (let i = 0; i < gamesAmount; i += 1) {
            const game = commonGames[i];
            let details = Cacher.get(`${game.appid}`);

            if (!details || !details.tags) {
                details = await getGameDetails(game.appid);
            }

            if ('Multiplayer' in details.tags) {
                multiplayerGames.push(details);
            }
        }

        ctx.status = 200;
        ctx.body = multiplayerGames;
    } else {
        ctx.status = 400;
        ctx.body = 'It seems that you\'ve forgotten user ids!';
    }
};

export default commonList;
