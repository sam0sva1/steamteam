import Router from 'koa-router';

const router = new Router({
    prefix: '/user',
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

        const {
            
        } = player;
        const data = {

        };

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