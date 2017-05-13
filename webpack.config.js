var webpack = require("webpack");

var path = require('path');

var publicPath         = 'http://localhost:8081/public/assets';
// var cssName            = process.env.NODE_ENV === 'production' ? 'styles-[hash].css' : 'styles.css';
var jsName             = process.env.NODE_ENV === 'production' ? 'bundle-[hash].js' : 'bundle.js';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  new webpack.LoaderOptionsPlugin({
    debug: process.env.NODE_ENV !== 'production'
  })
];

module.exports = {
  entry: ['./src/index.js'],
  plugins: plugins,
  output: {
    path: `${__dirname}/build/`,
    filename: jsName
  },
  resolve:{
    modules: ["./",path.resolve(__dirname,"src"), "node_modules"],
    extensions: ["*",".js"]
  },
  module:{
    rules: [
        {test: /\.js/,use: 'babel-loader', exclude: [/node_modules/]}
      ]
  }
}
