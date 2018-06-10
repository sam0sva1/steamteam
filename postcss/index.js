export default () => {
    return [
        require('autoprefixer')({ browsers: 'last 4 version' }),
        require('postcss-nested'),
    ];
};
