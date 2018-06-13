import fs from 'fs';

function saveCachedData(data) {
    if (!fs.existsSync('./cacheData')) {
        fs.mkdirSync('./cacheData');
    }

    fs.writeFileSync('./cacheData/cached.json', JSON.stringify(data, null, '  '));
    console.log('===> Cache was saved!');
}

export default saveCachedData;
