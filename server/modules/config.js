import fs from 'fs';

const build = (path) => {
    const file = fs.readFileSync(path);
    return JSON.parse(file);
}

export default {
    build,
};
