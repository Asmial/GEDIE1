const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'web',
    entry: {
        style: './client/scss/style.scss',
        index: {
            import: './client/js/index.js',
            dependOn: ['bootstrap', 'videoElements', 'dashjs', 'hlsjs', 'muslos', 'actores', 'videoCards', 'secuencias', 'videoTracks']
        },
        videoPlayer: {
            import: './client/js/videoPlayer.js',
            dependOn: ['jquery_ui_bundle','videoElements', 'videoCards', 'secuencias']
        },
        videoEvents: {
            import: './client/js/videoEvents.js',
            dependOn: ['jquery','videoElements', 'videoPlayer']
        },
        videoTracks: {
            import: './client/js/videoTracks.js',
            dependOn: ['jquery','videoElements', 'secuencias', 'actores', 'muslos', 'videoCards']
        },
        secuencias: {
            import: './client/js/secuencias.js',
            dependOn: ['jquery', 'videoElements']
        },
        muslos: {
            import: './client/js/muslos.js',
            dependOn: ['jquery']
        },
        actores: {
            import: './client/js/actores.js',
            dependOn: ['jquery']
        },
        videoElements: {
            import: './client/js/videoElements.js',
            dependOn: 'jquery'
        },
        videoCards: {
            import: './client/js/videoCards.js',
            dependOn: 'jquery'
        },
        dashjs: 'dashjs',
        hlsjs: 'hls.js',
        jquery: 'jquery',
        jquery_ui_bundle: {
            import: ['jquery-ui', 'jquery-ui-bundle'],
            dependOn: ['jquery', 'bootstrap'],
        },
        bootstrap: 'bootstrap'
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
            filename: '../dev.html',
            template: 'client/index.html'
        })
    ],

    devtool: "source-map"
}