const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.tsx'],
  },
  module: {
    rules: [
      {test: /\.tsx$/, use: 'babel-loader', exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/], use: 'file-loader'},
      {test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/], use: 'url-loader'},
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
  ],
  optimization: {
    minimizer: isProduction ? [new TerserWebpackPlugin()] : [],
  },
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    stats: 'errors-only',
    overlay: true,
  }
}
