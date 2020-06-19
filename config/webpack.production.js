const config = require('./webpack.shared')()

config.mode = 'production'
config.bail = true

config.output.filename = 'js/[name].[hash:12].min.js'

module.exports = config
