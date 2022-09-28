const path = require("path");

// https://webpack.js.org/guides/getting-started/

module.exports = {
  entry: "./src/script.js",
  optimization: {
    minimize: false
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, '../dist')
  }
};


