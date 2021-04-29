const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
webpack({
   target: 'web',
   entry: {
      style: './client/scss/style.scss',
      index: {
          import: './client/js/index.js',
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
      // hlsjs: 'hls.js',
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
   mode: 'production',
   output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'html/bundle')
   },
   resolve: {
      fallback:
      {
         "stream": require.resolve("stream-browserify"),
         "buffer": require.resolve("buffer/")
      }
   },
   optimization: {
      runtimeChunk: 'single',
      minimize: true
   },
   plugins: [
      new HtmlWebpackPlugin({
         filename: '../index.html',
         template: 'client/index.html'
      })
   ],
}, (err, stats) => {
   if (err || stats.hasErrors()) {
      console.error(err);
   }
});

if (process.argv[2] === 'full') {
   var os = require('os');
   var exec = require('child_process').exec;
   switch (os.type()) {
      case 'Linux':
      case 'Darwin':
         exec('./scripts/build-client.sh')
         break;
      case 'Windows_NT':
         exec('.\\scripts\\build-client.bat')
         break;
      default:
         throw new Error("Unsupported OS found: " + os.type());
   }
}