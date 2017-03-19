var webpack = require("webpack");
var path = require("path");

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', "stage-0"]
        }
      }
    ]
  },
  entry: {
    app: "./src/js/Router.js"
  },
  output: {
    path: path.resolve(__dirname, "public/dynamic"),
    publicPath: "dynamic",
    filename: "app.js"
  },
  devServer: {
    inline: true,
    hot: true,
    contentBase: "public/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
};
