const HtmlWebpackPlugin = require("html-webpack-plugin"); // convenient, but unnecessary

module.exports = {
  mode: "development",
  entry: "./src/example/index.js",
  output: {
    path: `${__dirname}/build`,
    filename: "bundle.js",
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // tell webpack to apply this rule to files ending in .jsx or .js
        exclude: /node_modules/,
        use: "babel-loader", // absolutely necessary. otherwise webpack doesn't know to use babel
      },
    ],
  },
  plugins: [ // just the config for the plugin on line 1
    new HtmlWebpackPlugin({
      template: "src/example/index.html",
    }),
  ],
};
