const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'web',
    entry: {
        style: './client/scss/style.scss',
        index: {
            import: './client/index.js',
            dependOn: ['jquery_ui_bundle', 'bootstrap', 'videoElements', 'dashjs', 'hlsjs']
        },
        videoElements: {
            import: './client/videoElements.js',
            dependOn: 'jquery'
        },
        dashjs: 'dashjs',
        hlsjs: 'hls.js',
        jquery: 'jquery',
        jquery_ui_bundle: {
            import: ['jquery-ui', 'jquery-ui-bundle'],
            dependOn: 'jquery',
        },
        bootstrap: ['bootstrap'],
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: '[name].css' }
                    },
                    'sass-loader'
                ]
            }
        ],
    },
    mode: 'development',
    watch: true,
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'html/bundle'),
        sourceMapFilename: "[name].[contenthash].bundle.js.map"
    },
    resolve: {
        fallback:
        {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        }
    },
    optimization: {
        runtimeChunk: 'single'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: 'client/index.html'
        })
    ],

    devtool: "source-map"
}