const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
webpack({
   entry: './js/index.js',
   mode: 'development',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'html/bundle')
   }
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