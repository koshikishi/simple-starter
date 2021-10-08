import path from 'path';

const config = {
  entry: './source/js/main.js',
  output: {
    path: path.resolve(__dirname, 'build/js'),
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  devtool: 'source-map',
};

export default config;
