const fetching = require('../modules').fetching;


const methods = {};

const baseUrl = 'http://steamspy.com';

methods.getGameById = async (id) => {
    return await fetching(`${baseUrl}/api.php?request=appdetails&appid=${id}`);
};

methods.getTop100Forever = async (id) => {
    return await fetching(`${baseUrl}/api.php?request=appdetails&appid=${id}`);
};

methods.getTop100In2Weeks = async (id) => {
    return await fetching(`${baseUrl}/api.php?request=appdetails&appid=${id}`);
};

export default methods;
