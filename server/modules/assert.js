export default {
    equal: function(firstValue, secondValue, filePath) {
        if (firstValue === secondValue) {
            console.log(`Test ${filePath ? `${filePath} ` : ''}passed!`);
        } else {
            throw new Error('Assert failed, ' + firstValue + ' is not equal to ' + secondValue + '.');
        }
    }
};