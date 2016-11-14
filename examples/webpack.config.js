const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const production = env === 'production';
const development = env === 'development';

const config = {
  entry: {
    examples: [path.resolve(__dirname, 'src/examples.js')],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: development ? '[name].bundle.js' : '[name].bundle[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  plugins: [
    function copyPage() {
      // provide src/index.html as an asset
      this.plugin('emit', function onEmit(compilation, cb) { // eslint-disable-line prefer-arrow-callback
        const srcPath = path.join(__dirname, 'src/index.html');
        const fileContents = fs.readFileSync(srcPath, 'utf8');

        compilation.assets['index.html'] = { // eslint-disable-line no-param-reassign
          source() {
            return fileContents;
          },
          size() {
            return fileContents.length;
          },
        };

        cb();
      });
    },
  ],
  devServer: {
    stats: 'errors-only',
    port: 3000,
    contentBase: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
};

if (production) {
  config.plugins.push(
    function saveHashStats() {
      this.plugin('done', function saveStats(stats) { // eslint-disable-line prefer-arrow-callback
        const statsJson = JSON.stringify({
          hash: stats.hash,
        });
        fs.writeFileSync(path.join(__dirname, 'build/stats.json'), statsJson);
      });
    }
  );
}

module.exports = config;
