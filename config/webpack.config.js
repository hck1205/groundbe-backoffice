const path = require("path")
const getPluginList = require("./webpack.plugins")
const rules = require("./webpack.rules")

const isDevMode = process.env.NODE_ENV === "development"

module.exports = {
  mode: isDevMode ? "development" : "production",

  entry: {
    vendor: ["@babel/polyfill", "eventsource-polyfill", "react", "react-dom"],
    app: [
      "@babel/polyfill",
      "eventsource-polyfill",
      path.resolve(__dirname, "..", "src")
    ]
  },

  output: {
    path: path.resolve(__dirname, "..", "dist"),
    filename: isDevMode ? "[name].js" : "[name].[contenthash:8].js",
    chunkFilename: isDevMode
      ? "[name].chunk.js"
      : "[name].[contenthash:8].chunk.js"
  },

  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js", ".json", ".css", "scss", "png", "jpg"],
    alias: {
      "~": path.resolve(__dirname, "../node_modules"),
      assets: path.resolve(__dirname, "../src/assets"),
      constants: path.resolve(__dirname, "../src/constants"),
      components: path.resolve(__dirname, "../src/components"),
      pages: path.resolve(__dirname, "../src/pages"),
      containers: path.resolve(__dirname, "../src/containers"),
      lib: path.resolve(__dirname, "../src/lib")
    }
  },

  module: { rules },

  optimization: !isDevMode
    ? {
        minimize: true, // UglifyJsPlugin
        concatenateModules: true, // Tells webpack to find segments of the module graph which can be safely concatenated into a single module
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: "initial",
              name: "vendor",
              enforce: true
            }
          }
        }
      }
    : {},

  plugins: getPluginList(isDevMode),

  devtool: isDevMode ? "inline-source-map" : "cheap-module-source-map",

  devServer: isDevMode
    ? {
        contentBase: path.join(__dirname, "..", "dist"),
        port: 3210,
        hot: true,
        open: true,
        historyApiFallback: true
      }
    : {}
}
