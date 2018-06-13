import { SteamSpyService } from '../services';
import { assert } from '../modules';


async function getList() {
    const list = await SteamSpyService.getListOfTopGames();

    assert.equal(list.length, 100, __filename);
}

getList();