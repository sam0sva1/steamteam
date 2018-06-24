export default (lists) => {
    console.time('compare');
    const sorted = lists.sort(((a, b) => a.length - b.length));

    let initial = [];
    let common = sorted[0];
    
    
    for (let i = 1; i < sorted.length; i += 1) {
        const list = sorted[i];

        if (!list || !list.length) return [];

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
