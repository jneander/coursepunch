const glob = require("glob")
const path = require('path')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function selectEnv(env) {
  return ['development', 'production', 'test'].includes(env) ? env : 'development'
}

function listStyles(srcPath) {
  const list = [path.join(srcPath, 'styles/reset.css')]
  glob.sync(path.join(srcPath, 'styles/*.css')).forEach(entry => {
    if (!list.includes(entry)) {
      list.push(entry)
    }
  })
  return list
}

module.exports = function() {
  const pkgPath = path.join(__dirname, '..')
  const srcPath = path.join(pkgPath, 'src')
  const appEnv = selectEnv(process.env.NODE_ENV)

  return {
    devtool: 'source-map',

    entry: {
      index: path.join(srcPath, 'index.js'),
      styles: listStyles(srcPath)
    },

    mode: 'none',

    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: require('./babelOptions')
            }
          ]
        },

        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },

        {
          exclude: /node_modules/,
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader?limit=10000&name=img/[hash:12]/[ext]'
            }
          ]
        }
      ]
    },

    optimization: {
      minimize: appEnv === 'production',

      splitChunks: {
        automaticNameDelimiter: '~',

        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },

          vendors: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/
          }
        },

        chunks: 'all',
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        maxSize: 200000,
        minChunks: 1,
        minSize: 30000,
        name: true
      },

      usedExports: true
    },

    output: {
      path: path.join(pkgPath, 'dist'),
      publicPath: '/'
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        chunkFilename: '[id].css',
        filename: '[name].css'
      }),

      new HtmlWebpackPlugin({
        inject: true,
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        },
        template: path.join(srcPath, 'markup/index.html')
      })
    ],

    resolve: {
      alias: {
        React: 'react'
      },
      modules: [srcPath, 'node_modules']
    },

    stats: {
      colors: true
    }
  }
}
