const steamService = require('../services').steam;
const compare = require('../modules').compare;

const commonList = async ctx => {
    const { user_ids } = ctx.query;
    if (user_ids) {
        const ids = user_ids.split(',');
        const lists = await Promise.all(ids.map(id => steamService.getGamesListById(id, ctx.config.steam_key)));
        const result = compare(lists);
        console.log('result', result.length);
        ctx.status = 200;
        ctx.body = JSON.stringify(result);
    } else {
        ctx.status = 400;
        ctx.body = 'It seems that you\'ve forgotten user ids!';
    }
};

module.exports = commonList;
