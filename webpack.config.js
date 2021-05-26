const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',
    entry: {
        index: {
            import: './client/main.js',
            dependOn: ['bootstrap', 'videoElements', 'muslos', 'actores', 'videoCards', 'secuencias', 'videoTracks']
        },
        videoPlayer: {
            import: './client/js/videoPlayer.js',
            dependOn: ['jquery_ui_bundle', 'videoElements', 'videoCards', 'secuencias']
        },
        videoEvents: {
            import: './client/js/videoEvents.js',
            dependOn: ['jquery', 'videoElements', 'videoPlayer']
        },
        videoTracks: {
            import: './client/js/videoTracks.js',
            dependOn: ['jquery', 'videoElements', 'secuencias', 'actores', 'muslos', 'videoCards']
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
        jquery: 'jquery',
        jquery_ui_bundle: {
            import: ['jquery-ui', 'jquery-ui-bundle'],
            dependOn: ['jquery', 'bootstrap'],
        },
        bootstrap: 'bootstrap'
    },
    mode: 'development',
    watch: true,
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: "file-loader",
                options: { name: '[name].[contenthash].[ext]', outputPath: 'css/fonts' }
            }
        ],
    },
    output: {
        filename: 'lib/[name].[contenthash].js',
        path: path.resolve(__dirname, 'package/'),
        sourceMapFilename: "lib/[name].[contenthash].bundle.js.map"
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
    ignoreWarnings: [
        {
            module: /peerjs\.min\.js/
        }
    ],
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'dev.html',
            template: 'client/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'rdev.html',
            template: 'client/room.html'
        }),
        new MiniCssExtractPlugin({ filename: "css/[name].[contenthash].css" })
    ],

    devtool: "source-map"
}