const path = require('path');

module.exports = (env, argv) => (
  {
    entry: './src/js/main.js',
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: 'main.js'
    },
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