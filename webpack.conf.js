var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: ['./src/index.jsx'],
    },
    module: {loaders: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['es2015'],
            },
        },
        {
            test: /\.jsx$/,
            include: path.resolve(__dirname, 'src'),
            loader: 'babel',
            query: {
                presets: ['react', 'es2015'],
            },
        }
    ]},
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        React: 'react',
      }),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
};