const Sleep = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 250);
    });
}

export default Sleep;
