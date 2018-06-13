import { SteamService } from '../services';
import { compare, Cacher } from '../modules';

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
            const details = Cacher.get(game.appid);

            if (!details || !details.tag) {
                 
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
