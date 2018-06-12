export default () => {
    return [
        require('postcss-import')({
            path: ['client/css'],
        }),
        require('autoprefixer')({ browsers: 'last 4 version' }),
        require('postcss-nested-ancestors'),
        require('postcss-nested'),
    ];
};
