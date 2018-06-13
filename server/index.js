import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';

import { Configer, Cacher } from './modules';
import { userRouter, gamesRouter } from './routes';

const app = new Koa();
const router = new Router();
const port = 8080;

const config = Configer.build('./config.json');
app.context.config = config;

app.use(logger());

app.use(serve(path.resolve(__dirname, '..', 'public')));

app.use(userRouter.routes());
app.use(gamesRouter.routes());

app.listen(port, () => {
    console.info(`
=================================
Server is running of port ${port}
=================================
    `);

    Cacher.init('./cacheData/cached.json');
});