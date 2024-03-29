/* eslint-env node */

'use strict';

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
var browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');


module.exports = function(karma) {
  karma.set({

    frameworks: [
      'mocha',
      'chai',
      'webpack'
    ],

    files: [
      'test/testBundle.js'
    ],

    preprocessors: {
      'test/testBundle.js': [ 'webpack' ]
    },

    reporters: 'dots',

    browsers,

    browserNoActivityTimeout: 30000,

    autoWatch: false,
    singleRun: true,

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(bpmn|dmn|cmmn|css)$/,
            use: 'raw-loader'
          }
        ]
      }
    }
  });

};
