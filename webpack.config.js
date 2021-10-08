import path from 'path';

const config = {
  mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
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
