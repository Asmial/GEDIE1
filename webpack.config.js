const path = require('path');

module.exports = {
    target: 'web',
    entry: './client/index.js',
    mode: 'development',
    watch: true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'html/bundle'),
        sourceMapFilename: "bundle.js.map"
    },
    
    devtool: "source-map"
}