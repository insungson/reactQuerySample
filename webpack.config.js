const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  entry: {
    app: './app.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: [
          ['@babel/preset-env',{
            targets: {browsers: ['last 2 chrome versions']},
            debug: true,
          }],
          '@babel/preset-react',
        ],
        plugins: ['react-hot-loader/babel'],
      },
      exclude: path.join(__dirname, 'node_modules'),
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  plugins: [],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist',
  },
};