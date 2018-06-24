import Router from 'koa-router';
import compare from '../modules/compare';
import queue from '../modules/queue';
import SteamService from '../services/steam';

const emitError = (err, ctx) => {
    ctx.status = err.status || 500;
    ctx.type = 'application/json';
    ctx.body = { error: true };
    ctx.app.emit('error', err, ctx);
}

const getCommonGamesList = async ctx => {
    const { user_ids } = ctx.query;
    if (user_ids) {
        const ids = user_ids.split(',');
        let lists;

        try {
            lists = await Promise.all(ids.map(id => SteamService.getGamesListById(id, ctx.config.steam_key)));
        } catch (err) {
            emitError(err, ctx);
        }
        lists = lists.map(list => list.response.games);
        const commonGames = compare(lists);

        if (!commonGames) {
            ctx.status = 200;
            ctx.body = [];
            return;
        }

        const details = await Promise.all(
            commonGames.map((game) => {
                return new Promise(async (resolve, reject) => {

                    function catchResult(result) {
                        const data = Object.assign({}, result, game);
                        resolve(data);
                    }

                    try {
                        queue(game.appid, catchResult);
                    } catch (err) {
                        emitError(err, ctx);
                    }
                })
            })
        );

        const multiplayerGames = details
            .filter((game) => (game && ('Multiplayer' in game.tags)))
            .map((game) => {
                const {
                    appid,
                    name,
                    genre,
                    img_logo_url,
                } = game;

                return {
                    appid,
                    name,
                    genre,
                    img_logo_url,
                };
            })
            .sort((a, b) => {
                const first = a.name.toLowerCase();
                const second = b.name.toLowerCase();
                if (first < second) return -1;
                if (first > second) return 1;
                return 0;
            });

        ctx.status = 200;
        ctx.body = multiplayerGames;
    } else {
        ctx.status = 400;
        ctx.body = 'It seems that you\'ve forgotten user ids!';
    }
};

const router = new Router({
    prefix: '/games',
});

router.get('/common', getCommonGamesList);

export default router;
