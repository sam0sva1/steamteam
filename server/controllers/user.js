import { SteamService } from '../services';

const user = async ctx => {
    const { name } = ctx.params;
    const idRes = await SteamService.getUserByName(name, ctx.config.steam_key);
    if (idRes.response.success !== 1) {
        ctx.status = 404;
        ctx.body = { success: 0 };
        return;
    }

    const userData = await SteamService.getPlayerDetails(idRes.response.steamid, ctx.config.steam_key);
    const player = userData.response.players[0];

    if (player) {
        ctx.status = 200;
        ctx.body = { player, success: 1 };
    } else {
        ctx.status = 404;
        ctx.body = { success: 0 };
    }
}

export default user;
