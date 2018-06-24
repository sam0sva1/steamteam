import path from 'path';
import fs from 'fs';
import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';

import Cacher from './modules/cacher';
import cacheWarming from './modules/cacheWarming';
import { userRouter, gamesRouter } from './routes';

const app = new Koa();
const router = new Router();
const port = 8080;

const file = fs.readFileSync(path.resolve(__dirname, '..', 'config.json'));
app.context.config = JSON.parse(file);

app.use(logger());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.type = 'application/json';
        ctx.body = { error: true };
        ctx.app.emit('error', err, ctx);
    }
});

app.use(serve(path.resolve(__dirname, '..', 'public')));

app.use(userRouter.routes());
app.use(gamesRouter.routes());

app.on('error', (err) => {
    console.error('Error message', err.message);
    console.error('Error', err);
});

const server = app.listen(port, () => {
    console.info(`
=================================
Server is running of port ${port}
=================================
    `);

    Cacher.init((setStorage) => {
        const cachePath = path.resolve(__dirname, '..', 'cacheData', 'cached.json');
        console.log('cachePath', cachePath);
        if (fs.existsSync(cachePath)) {
            const file = fs.readFileSync(cachePath);
            const list = JSON.parse(file);
            setStorage(list);

            console.log('===> Cache is ready!');
        } else {
            cacheWarming('./CacheData/forCache.json');
        }
    });
});

process.on('SIGINT', function onSigterm () {
    console.info('\nGraceful shutdown started!');
    shutdown();
});

function shutdown() {
    server.close(function onServerClosed (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        Cacher.save('../cacheData');
        process.exit();
    });
}
