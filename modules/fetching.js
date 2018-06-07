const request = require('request-promise-native');


const fetching = (url) => {
    console.log('[GET] =>', url);
    return request({
        url: url,
        gzip: true,
        followRedirect: true,
        transform: (data, response) => {
            return JSON.parse(data);
        },
    });
};

module.exports = fetching;
