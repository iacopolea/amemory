const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => (
  {
    entry: './src/js/main.js',
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: 'main.js'
    },
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    },
    devtool: "source-map",
    watch: (argv.mode === 'development'),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    }
});