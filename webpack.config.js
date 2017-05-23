const webpack = require("webpack");
const path = require('path');
const env = process.env.NODE_ENV;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const srcRoot = path.resolve(__dirname, "src");

var publicPath         = process.env.NODE_ENV === 'production' ? 'https://demo.ya64.uk/' : 'http://localhost:8081/assets/';
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
  })
];

module.exports = {
  context: srcRoot,
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
    modules: ["node_modules",".",srcRoot],
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
        //exclude: [/node_modules/],
        use: ['style-loader/url', 
          'file-loader?name=[name].[ext]&publicPath='+publicPath+'styles/&outputPath=../styles/' ]
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
