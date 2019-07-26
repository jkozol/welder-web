const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const babelConfig = require("./babel.config");

const [mode, devtool] =
  process.env.NODE_ENV === "production" ? ["production", "source-map"] : ["development", "inline-source-map"];

const output = {
  path: path.resolve(__dirname, "./public/dist"),
  filename: "[name].js",
  sourceMapFilename: "[file].map"
};

// add istanbul as babel plugin to enable code coverage
process.argv.includes("--with-coverage") && babelConfig.plugins.push("istanbul");

const plugins = [
  new CleanWebpackPlugin(["public/dist"]),
  // automatically load jquery instead of having to import or require them everywhere
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  // copy our assets
  new CopyWebpackPlugin([
    {
      from: "./public/custom.css"
    },
    {
      from: "./public/manifest.json"
    }
  ]),
  // main.js has to be injected into body and after <div id="main"></div>
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "public/index.ejs",
    inject: "body"
  }),
  // avoid multi chunks for every index.js inside pages folder
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }),
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].bundle.css"
  })
];

module.exports = {
  mode: mode,
  // redux-saga uses generators, babel compiles using regenerator runtime included in @babel/polyfill
  entry: ["@babel/polyfill", "./main.js"],
  plugins: plugins,
  output: output,
  devtool: devtool,
  externals: { cockpit: "cockpit", jQuery: "jquery" },
  // disable noisy warnings about exceeding the recommended size limit
  performance: {
    maxEntrypointSize: 20000000,
    maxAssetSize: 20000000
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /build/],
        use: "eslint-loader"
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, "./actions"),
          path.resolve(__dirname, "./components"),
          path.resolve(__dirname, "./core"),
          path.resolve(__dirname, "./pages"),
          path.resolve(__dirname, "./data"),
          path.resolve(__dirname, "./main.js")
        ],
        use: {
          loader: "babel-loader",
          options: babelConfig
        }
      },
      // add type: "javascript/auto" when transforming JSON via loader to JS
      {
        include: [path.resolve(__dirname, "./routes.json")],
        use: [
          {
            loader: "babel-loader",
            options: babelConfig
          },
          path.resolve(__dirname, "./utils/routes-loader.js")
        ],
        type: "javascript/auto"
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "./pages"),
          path.resolve(__dirname, "node_modules/patternfly"),
          path.resolve(__dirname, "node_modules/@patternfly/patternfly"),
          path.resolve(__dirname, "node_modules/@patternfly/react-styles/css"),
          path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/styles/base.css"),
          path.resolve(__dirname, "node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly")
        ],
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        // only process modules with this loader
        // if they live under a 'fonts' or 'pficon' directory
        use: {
          loader: "file-loader"
        }
      },
      {
        test: /\.(jpg)$/i,
        loader: "url-loader"
      }
    ]
  }
};
