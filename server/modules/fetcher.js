const request = require('request-promise-native');
const errors = require('../modules/errors');


const fetcher = (url) => {
    console.log('[GET] =>', url);
    return request({
        url: url,
        gzip: true,
        followRedirect: true,
        transform: (data, response) => {

            if (response.statusCode === 200) {
                if (response.headers['content-type'].indexOf('application/json') !== -1) {
                    return JSON.parse(data);
                }

                return data;
            }

            throw new errors.RequestError(response.statusCode);
        },
    });
};

module.exports = fetcher;
