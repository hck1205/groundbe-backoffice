const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

// Common Plugins
module.exports = isDevMode => {
  let pluginList = [
    // Loader Options
    new webpack.LoaderOptionsPlugin({
      minimize: true // Where loaders can be switched to minimize mode.
    }),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),

    // Read index.html file and use it as a template for dev-server
    // Produce index.html when webpack build
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "../public", "index.html"),
      favicon: path.resolve(__dirname, "../public", "favicon.ico")
    })
  ]

  // Dev Plugins
  if (isDevMode) {
    pluginList.push(
      // Ts Type Checker
      new ForkTsCheckerWebpackPlugin(),

      new MiniCssExtractPlugin({
        path: path.resolve(__dirname, "..", "dist"),
        filename: "styles.css"
      })
    )

    // Prod Plugins
  } else {
    /**
     * Todo: Add OptimizeCssAssetsPlugin for optimized css file
     */
    pluginList.push(
      // It removes old chunk files after webpack building
      new CleanWebpackPlugin(),

      new MiniCssExtractPlugin({
        path: path.resolve(__dirname, "..", "dist"),
        filename: "styles.[contenthash:8].css",
        chunkFilename: "styles.[contenthash:8].chunk.css"
      })
    )
  }

  return pluginList
}
