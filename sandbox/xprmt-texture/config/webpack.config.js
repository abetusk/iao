const path = require("path");
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

// https://webpack.js.org/guides/getting-started/

module.exports = {
  entry: "./src/script.js",
  optimization: {
    minimize: false
  },

  module: {
    rules: [

      {
        test: /\.css$/i,
        use: ["style-loader", "css-load"]
      },

      {
        test: /\.(glsl|vs|fs|vert|frag)$/i,
        exclude: /node_modules/,
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
      publicPath: "./"
    })
  ],

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, '../dist')
  }

};


