const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  experiments: {
    topLevelAwait: true
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: './dist',
    open: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js'],
  },
};
