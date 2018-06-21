import Router from 'koa-router';
import Sleep from '../modules/sleep';
import Cacher from '../modules/cacher';
import compare from '../modules/compare';
import { SteamSpyService, SteamService } from '../services';


let list = [];
const handlersBox = {};
let listIsEmpty = true;
let counter = 0;
let isRunning = false;

let sleeper = Sleep();
async function runRequests() {
    if (isRunning) return;
    isRunning = true;

    async function watcher(i) {
        await sleeper;
        const id = list[i];

        if (!id) {
            listIsEmpty = true;
            return;
        }

        const handlers = handlersBox[id];

        const gameDetails = await SteamSpyService.getGameDetalesById(id);

        sleeper = Sleep(250);

        Cacher.set(id, gameDetails);

        while (handlers.length) {
            const handler = handlers.pop();
            handler(gameDetails);
        }
    }

    do {
        await watcher(counter);
        if (list[counter + 1]) {
            counter += 1;
            listIsEmpty = false;
        } else {
            listIsEmpty = true;
        }
    } while (!listIsEmpty);
    isRunning = false;
}


async function queue(id, handler) {
    const game = Cacher.get(id);
    if (game) {
        handler(game);
        return;
    };


    if (list.indexOf(id) === -1) {
        list.push(id);
    }
    
    if (!handlersBox[id]) handlersBox[id] = [];
    handlersBox[id].push(handler);

    runRequests();
}

const commonList = async ctx => {
    const { user_ids } = ctx.query;
    if (user_ids) {
        const ids = user_ids.split(',');
        const lists = await Promise.all(ids.map(id => SteamService.getGamesListById(id, ctx.config.steam_key)));
        const commonGames = compare(lists);

        if (!commonGames) {
            ctx.status = 200;
            ctx.body = [];
            return;
        }

        const details = await Promise.all(
            commonGames.map((game) => {
                return new Promise(async (resolve, reject) => {
                    function setResult(result) {
                        const data = Object.assign({}, result, game);
                        resolve(data);
                    }
                    queue(game.appid, setResult);
                })
            })
        );

        const multiplayerGames = details
            .filter(({ tags }) => ('Multiplayer' in tags))
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

router.get('/common', commonList);

export default router;
