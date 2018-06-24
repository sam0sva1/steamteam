import Router from 'koa-router';

import SteamService from '../services/steam';


const serializePlayer = (playerDraft) => {
    const {
        steamid,
        personaname,
        avatarmedium,
    } = playerDraft;

    return {
        steamid,
        personaname,
        avatarmedium,
    };
};

const router = new Router({
    prefix: '/user',
});

router.get('/list', async ctx => {
    const { user_ids } = ctx.query;

    if (user_ids) {
        const ids = user_ids.split(',');
        let players = [];

        try {
            players = await SteamService.getPlayerDetails(user_ids, ctx.config.steam_key);
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.type = 'application/json';
            ctx.body = { error: true };
            ctx.app.emit('error', err, ctx);
            return;
        }

        const data = players.response.players.map(serializePlayer);

        ctx.status = 200;
        ctx.type = 'application/json';
        ctx.body = { players: data, success: 1 };
    }
});

router.get('/:name', async ctx => {
    const { name } = ctx.params;
    const idRes = await SteamService.getUserByName(name, ctx.config.steam_key);
    if (idRes.response.success !== 1) {
        ctx.status = 404;
        ctx.type = 'application/json';
        ctx.body = { success: 0 };
        return;
    }

    const userData = await SteamService.getPlayerDetails(idRes.response.steamid, ctx.config.steam_key);
    const player = userData.response.players[0];

    if (player) {
        const data = serializePlayer(player);

        ctx.status = 200;
        ctx.type = 'application/json';
        ctx.body = { player, success: 1 };
    } else {
        ctx.status = 404;
        ctx.type = 'application/json';
        ctx.body = { success: 0 };
    }
});

export default router;