const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const configer = require('./modules').config;
const steamService = require('./services').steam;
const controllers = require('./controllers');

const config = configer.build('./config.json');

const app = new Koa();
const router = new Router();

app.use(logger());
app.context.config = config;

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

router.get('/get-common/', controllers.getCommon);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
    console.log('GO!');
});