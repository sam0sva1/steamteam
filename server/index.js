import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';

import { Configer, Cacher } from './modules';
import { SteamService } from './services';
import { commonList } from './controllers';

Cacher.init('./cached.json');
const app = new Koa();
const router = new Router();

app.use(logger());

const config = Configer.build('./config.json');
app.context.config = config;

app.use(serve(path.resolve(__dirname, '..', 'public')));

router.get('/user/:name/', async ctx => {
    console.log('GET user');
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
});

router.get('/get-common/', commonList);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
    console.log('GO!');
});