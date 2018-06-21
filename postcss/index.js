export default () => {
    return [
        require('postcss-import')({
            path: ['client/css'],
        }),
        require('postcss-mixins'),
        require('autoprefixer')({ browsers: 'last 4 version' }),
        require('postcss-nested-ancestors'),
        require('postcss-nested'),
    ];
};
