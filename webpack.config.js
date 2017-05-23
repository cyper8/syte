const webpack = require("webpack");
const path = require('path');
const env = process.env.NODE_ENV;
const ExtractTextPlugin = require('extract-text-webpack-plugin');


var publicPath         = process.env.NODE_ENV === 'production' ? 'https://demo.ya64.uk/jslibs' : 'http://localhost:8081/assets';
var jsName             = process.env.NODE_ENV === 'production' ? '[name]-[hash].js' : '[name].js';

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
  }),
  new ExtractTextPlugin({
    filename: '../styles/[id].css'
  })
];

module.exports = {
  entry:{
    client:'client.js',
    trinfo:'trinfo.js'
  },
  //devtool: 'inline-source-map',
  plugins: plugins,
  output: {
    path: `${__dirname}/assets/jslibs`,
    filename: jsName,
    publicPath
  },
  resolve:{
    modules: [path.resolve(__dirname,"src"), "node_modules"],
    extensions: ["*",".js", ".css"]
  },
  module:{
    rules: [
      {
        test: /\.js/,
        exclude: [/node_modules/],
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: ExtractTextPlugin.extract({
              fallback: 'style-loader/url',
              use: [ 'css-loader' ]
          })
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  }
}
