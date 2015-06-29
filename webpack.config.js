const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const LessPluginCleanCSS = require("less-plugin-clean-css")
const merge = require("./lib/merge")

const TARGET = process.env.TARGET
const ROOT_PATH = path.resolve(__dirname)

const common = {
  entry: [ path.join(ROOT_PATH, "app/main.jsx") ],
  resolve: {
    extensions: [ "", ".js", ".jsx" ]
  },
  output: {
    path: path.resolve(ROOT_PATH, "build"),
    filename: "bundle.js",
    publicPath: "http://localhost:3000/assets/"
  },
  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({ advanced: true })
    ]
  }
}

const mergeConfig = merge.bind(null, common)

if (TARGET === "build") {
  module.exports = mergeConfig({
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: "babel?stage=0",
          include: path.join(ROOT_PATH, "app")
        },
        { test: /\.css$/, loader: "style!css" },
        { test: /\.less$/, loader: "style!css!less" },
        { test: /\.json$/, loader: "json-loader" },
        { test: /\.json5$/, loader: "json5-loader" },
        { test: /\.txt$/, loader: "raw-loader" },
        { test: /\.html$/, loader: "html-loader" },
        { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url?limit=25000" },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=1000&mimetype=application/font-woff"
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=1000&mimetype=application/octet-stream"
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&mimetype=image/svg+xml"
        },
        { test: /\.md$/, loaders: [ "html-loader", "markdown-loader" ] }
      ]
    },
    plugins: [
      new ExtractTextPlugin("styles.css"),
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify("production")
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  })
}

if (TARGET === "dev") {
  module.exports = mergeConfig({
    entry: [ "webpack/hot/dev-server" ],
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          loader: "eslint-loader",
          include: path.join(ROOT_PATH, "app")
        }
      ],
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        { test: /\.less$/, loader: "style!css!less" },
        { test: /\.jsx?$/, loader: "react-hot!babel?stage=0", include: path.join(ROOT_PATH, "app") },
        { test: /\.json$/, loader: "json-loader" },
        { test: /\.json5$/, loader: "json5-loader" },
        { test: /\.txt$/, loader: "raw-loader" },
        { test: /\.html$/, loader: "html-loader" },
        { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url?limit=25000" },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&minetype=application/font-woff"
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&minetype=application/octet-stream"
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&minetype=image/svg+xml"
        },
        { test: /\.md$/, loaders: [ "html-loader", "markdown-loader" ] }
      ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  })
}
