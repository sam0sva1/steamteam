import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';

import { Configer } from './modules';
import { steam as steamService } from './services';
import { commonList } from './controllers';

const config = Configer.build('./config.json');

const app = new Koa();
const router = new Router();

app.use(logger());
app.context.config = config;

app.use(serve(__dirname + '/public'));

router.get('/', async ctx => {
    ctx.body = 'Run motherfucker run!';
});

router.get('/check/:name/', async ctx => {
    const { name } = ctx.params;
    const data = await steamService.getIdByName(name, ctx.config.steam_key);

    if (data.response.success === 1) {
        ctx.status = 200;
        ctx.body = JSON.stringify({ id: data.response.steamid, succes: 1 });
    } else {
        ctx.status = 404;
        ctx.body = JSON.stringify({ succes: 0 });
    }
});

router.get('/get-common/', commonList);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
    console.log('GO!');
});