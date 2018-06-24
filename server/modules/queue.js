import Sleep from '../modules/sleep';
import Cacher from '../modules/cacher';
import Errors from '../modules/errors';
import SteamSpyService from '../services/steamSpy';


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
        let gameDetails;

        try {
            gameDetails = await SteamSpyService.getGameDetalesById(id);
        } catch (err) {
            if (err instanceof Errors.RequestError) {
                gameDetails = null;
            }

            throw err;
        }

        sleeper = Sleep(250);

        if (gameDetails) {
            Cacher.set(id, gameDetails);
        }

        while (handlers && handlers.length) {
            const handler = handlers.pop();
            handler(gameDetails);
        }
    }

    do {
        console.log('Queue loop', Date.now());
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
        if (handler) handler(game);
        return;
    };

    if (list.indexOf(id) === -1) {
        list.push(id);
    }
    
    if (handler) {
        if (!handlersBox[id]) handlersBox[id] = [];
        handlersBox[id].push(handler);
    }

    runRequests();
}

export default queue;
