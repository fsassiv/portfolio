const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './projectName/dev/js/main.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'projectName/dist/js')
    },
    devtool: 'eval-source-map',
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals({
        whitelist: ['jquery']
    })], // in order to ignore all modules in node_modules folder
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /[node_modules]/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/es2015']
                }
            }
        }]
    }
}