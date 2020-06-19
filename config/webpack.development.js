const webpack = require('webpack')

const config = require('./webpack.shared')()

config.mode = 'development'

config.output.filename = 'js/[name].js'

config.plugins.push(new webpack.NamedModulesPlugin())

module.exports = config
