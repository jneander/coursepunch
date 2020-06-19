const config = require('./webpack.shared')()

config.output.filename = 'js/[name].js'
config.output.pathinfo = false

config.devtool = 'cheap-module-eval-source-map'

config.optimization = {
  removeAvailableModules: false,
  removeEmptyChunks: false,
  splitChunks: false
}

module.exports = config
