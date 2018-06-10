const compare = (lists) => {
    console.time('compare');
    const sorted = lists.sort(((a, b) => a.response.game_count - b.response.game_count));

    let initial = [];
    let common = sorted[0].response.games;
    
    
    for (let i = 1; i < sorted.length; i += 1) {
        const list = sorted[i].response.games;

        if (!list) continue;
        if (!list.length) return [];

        initial = common;
        common = [];

        for (let g = 0; g < initial.length; g += 1) {
            const required = initial[g];
            const found = list.find(game => game.appid === required.appid)
            if (found) {
                common.push(found);
            }
        }
    }
    console.timeEnd('compare');

    return common;
}


module.exports = compare;