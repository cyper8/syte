var webpack = require("webpack");

var path = require('path');


var publicPath         = 'http://localhost:8081/assets';
var jsName             = process.env.NODE_ENV === 'production' ? '[name].bundle-[hash].js' : '[name].bundle.js';

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
  entry:['client.js'],
  //devtool: 'inline-source-map',
  plugins: plugins,
  output: {
    path: `${__dirname}/assets/jslibs`,
    filename: jsName,
    publicPath
  },
  resolve:{
    modules: ["./",path.resolve(__dirname,"src"), "node_modules", "assets"],
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
