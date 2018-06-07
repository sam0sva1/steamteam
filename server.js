const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');

const app = new Koa();
const router = new Router();

app.use(logger());

router.get('/', async ctx => {
    ctx.body = 'Run motherfucker run!';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
    console.log('GO!');
});