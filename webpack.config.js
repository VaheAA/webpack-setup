const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const glob = require('glob');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode && 'source-map';

const htmlFiles = glob.sync('./src/**/*.html');

const htmlPlugins = htmlFiles.map((file) => {
  return new HtmlWebpackPlugin({
    filename: path.basename(file),
    template: file,
    inject: true,
    chunks: ['main'],
  });
});

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  entry: {
    main: ['@babel/polyfill', path.resolve(__dirname, 'src/assets/js', 'index.js')],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './assets/js/[name].[contenthash].js',
    assetModuleFilename: './assets/img/[hash][ext]',
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: './assets/css/[name].[contenthash].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: devMode ? 'server' : 'disabled', // Only enable analyzer in development mode
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
          'sass-loader',
        ],
      },
      {
        test: /\.woff2?$/i,
        type: 'asset/resource',
        generator: {
          filename: './assets/fonts/[name][ext]',
        },
      },
      {
        test: /\.(jpe?g|png|svg|webp|gif)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
        type: 'asset/resource',
        generator: {
          filename: './assets/img/[name][ext]',
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
  },
};
