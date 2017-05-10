var webpack = require("webpack");

var path = require('path');

var publicPath         = 'http://localhost:8050/public/assets';
var cssName            = process.env.NODE_ENV === 'production' ? 'styles-[hash].css' : 'styles.css';
var jsName             = process.env.NODE_ENV === 'production' ? 'bundle-[hash].js' : 'bundle.js';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

module.exports = {
  entry: ['./src/index.js'],
  debug: process.env.NODE_ENV !== 'production',
  resolve: {
    root: path.join(__dirname, 'src'),
    modulesDerectories: ['node_modules'],
    extensions: ['','.js']
  },
  plugins: plugins,
  output: {
    path: `${__dirname}/public/assets`,
    filename: jsName,
    publicPath: publicPath
  }
}
