var webpack = require("webpack");

var path = require('path');


var publicPath         = process.env.NODE_ENV === 'production' ? 'https://demo.ya64.uk/jslibs' : 'http://localhost:8081/assets';
var jsName             = process.env.NODE_ENV === 'production' ? 'basic.js?[hash]' : 'basic.js';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      C9_SH_EXECUTED: JSON.stringify(process.env.C9_SH_EXECUTED || 0)
    }
  }),
  new webpack.LoaderOptionsPlugin({
    debug: process.env.NODE_ENV !== 'production'
  })
];

module.exports = {
  entry:["index.js"],
  //devtool: 'inline-source-map',
  plugins: plugins,
  output: {
    path: `${__dirname}/assets/jslibs`,
    library: 'Basic',
    libraryTarget: 'var',
    filename: jsName,
    publicPath
  },
  resolve:{
    modules: [path.resolve(__dirname,"src/Basic"), "node_modules", "assets"],
    extensions: ["*",".js"]
  },
  module:{
    rules: [
      {
        test: /\.js/,
        exclude: [/node_modules/],
        use: 'babel-loader'
      }
    ]
  }
}
