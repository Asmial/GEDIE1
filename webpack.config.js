const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './js/index.js',
    mode: 'development',
    watch: true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'html/bundle'),
        sourceMapFilename: "bundle.js.map"
    },
    devtool: "source-map"
}