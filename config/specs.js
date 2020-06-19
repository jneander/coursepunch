const path = require('path')

const webpack = require('./webpack.test.js')

const CHROME_FLAGS = [
  '--use-mock-keychain',
  '--no-default-browser-check',
  '--no-first-run',
  '--disable-default-apps',
  '--disable-popup-blocking',
  '--disable-translate',
  '--disable-extensions',
  '--use-fake-ui-for-media-stream',
  '--use-fake-device-for-media-stream',
  '--allow-file-access-from-files'
]

let pattern = 'src/**/*.spec.js'
if (process.argv.includes('--pattern')) {
  pattern = process.argv[process.argv.indexOf('--pattern') + 1]
}

const files = [
  'spec-support/globals.js',
  {
    pattern,
    watched: false
  }
]

const preprocessors = {
  'src/**/*.spec.js': ['webpack', 'sourcemap'],
  'spec-support/globals.js': ['webpack', 'sourcemap']
}

const browsers = []
if (process.argv.includes('--no-headless')) {
  browsers.push('CustomChrome')
} else {
  browsers.push('CustomChromeHeadless')
}

module.exports = function configure(config) {
  config.set({
    browsers,
    frameworks: ['mocha'],

    /*
     * Make the karma-browser exchange more forgiving to avoid
     * premature disconnects and build failures.
     */
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 60000,

    /*
     * If the browser does not capture in given timeout (ms),
     * terminate the process.
     */
    captureTimeout: 30000,

    client: {
      mocha: {
        slow: 500,
        timeout: 1000
      }
    },

    customLaunchers: {
      CustomChrome: {
        base: 'Chrome',
        flags: CHROME_FLAGS
      },

      CustomChromeHeadless: {
        base: 'Chrome',
        flags: CHROME_FLAGS.concat([
          '-incognito',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ])
      }
    },

    colors: true,
    reporters: ['spec'],

    logLevel: config.LOG_INFO,

    port: 9876,

    basePath: path.join(__dirname, '..'),
    files,
    preprocessors,

    webpackServer: {
      noInfo: true
    },

    webpack
  })
}
