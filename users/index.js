const fs = require('fs');
const path = require('path');

const dir = fs.readdirSync('./users');
const files = dir.filter(entity => entity !== 'index.js');

const lists = files.map((name) => {
    const file = fs.readFileSync(path.resolve('.', 'users', name));
    return JSON.parse(file);
});

module.exports = {
    lists,
}