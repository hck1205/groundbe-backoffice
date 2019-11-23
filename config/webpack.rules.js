const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = [
  // Babel Config
  {
    test: /\.(ts|js|tsx)?$/,
    loader: "babel-loader",
    exclude: path.resolve(__dirname, "..", "node_modules"),
    options: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: { browsers: ["last 2 versions", ">= 5% in KR"] },
            modules: "false" // Tree Shaking
          }
        ], // Support last 2 versions of each individual browsers (ex. IE-10 & 11, Chrome, Firefox, Safari, Edge) and Browsers that take 5% of share in Korea.
        "@babel/preset-react",
        "@babel/preset-typescript"
      ],
      plugins: [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
      ],
      compact: true
    }
  },

  // CSS & SASS Config
  {
    test: /\.(sa|sc|c)ss$/,
    exclude: path.resolve(__dirname, "..", "node_modules"),
    use: [
      {
        loader: MiniCssExtractPlugin.loader, // for seperated .css file
        options: {
          hmr: process.env.NODE_ENV === "development"
        }
      },
      { loader: "css-loader" },
      { loader: "sass-loader" },
      {
        loader: "postcss-loader",
        options: {
          config: {
            path: path.resolve(__dirname, "./")
          }
        }
      }
    ]
  },

  // File-loader & Url-loader config
  {
    test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.ttf$|\.eot$/,
    loader: "file-loader",
    options: {
      name: "[name].[ext]"
    }
  }
]
