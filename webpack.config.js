const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const glob = require('glob');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode && 'source-map';

const htmlFiles = glob.sync('./src/**/*.html');

const htmlPlugins = htmlFiles.map((file) => new HtmlWebpackPlugin({
  filename: path.basename(file),
  template: file,
  inject: true,
  chunks: ['main'],
}));

module.exports = {
  mode,
  target,
  devtool,
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, 'src/assets/js', 'index.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './assets/js/[name].[contenthash].js',
    assetModuleFilename: './assets/img/[name].[contenthash][ext]',
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true, // Enable Hot Module Replacement
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: './assets/css/[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(), // Cleans the dist folder
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sc|sa)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              },
            },
          },
          '
