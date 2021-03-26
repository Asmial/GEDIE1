const path = require('path');

module.exports = {
    entry: './js/index.js',
    mode: 'development',
    watch: true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'html/bundle')
    }
}