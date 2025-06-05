const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
    test: /\.[jt]sx?$/, 
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: ['@babel/preset-react', '@babel/preset-typescript'],
        plugins: ['react-native-web']
      }
    }
};

const tsLoaderConfiguration = {
    test: /\.tsx?$/, 
    use: 'ts-loader',
    exclude: /node_modules/,
};

module.exports = {
  entry: [
    path.resolve(appDirectory, 'index.js')
  ],
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist')
  },

  module: {
    rules: [
      babelLoaderConfiguration,
      tsLoaderConfiguration,
    ]
  },

  plugins:[new HtmlWebpackPlugin({ template: './public/index.html'})],

  resolve: {
    alias: {
      'react-native$': 'react-native-web'
    },
    extensions: ['.web.js', '.js', '.tsx', '.ts']
  }
};