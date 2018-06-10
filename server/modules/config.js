const fs = require('fs');

const build = (path) => {
    const file = fs.readFileSync(path);
    return JSON.parse(file);
}

module.exports = {
    build,
};
