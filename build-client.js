const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
webpack({
   target: 'web',
    entry: {
        index: {
            import: './client/index.js',
            dependOn: ['jquery_ui_bundle', 'bootstrap']
        },
        videoElements: {
            import: './client/videoElements.js',
            dependOn: 'jquery'
        },
        jquery: 'jquery',
        jquery_ui_bundle: {
            import: ['jquery-ui', 'jquery-ui-bundle', '@popperjs/core'],
            dependOn: 'jquery',
        },
        bootstrap: ['bootstrap', '@popperjs/core'],
    },
    mode: 'development',
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
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: 'client/index.html'
        })
    ],
    devtool: "source-map"
}, (err, stats) => {
   if (err || stats.hasErrors()) {
      console.error(err)
   }
});

if (process.argv[2] !== 'min') {
   const sass = require('sass');
   var csswrite = fs.createWriteStream('html/bundle/bundle.css');
   var result = sass.renderSync({ file: "scss/index.scss" });
   csswrite.write(result.css)
}

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