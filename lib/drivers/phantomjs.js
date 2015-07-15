//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Object$defineProperties = require('babel-runtime/core-js/object/define-properties')['default'];

module.exports = function () {
  return _Object$defineProperties({
    runner: 'phantom_runner.js',
    callback: function callback(server, phantomProcess) {
      phantomProcess.once('close', function (code) {
        server && server.close();
        // process.exit(code);
      });
      phantomProcess.stdout.pipe(process.stdout);
      phantomProcess.stderr.pipe(process.stderr);
    }
  }, {
    command: {
      get: function () {
        try {
          return require('phantomjs').path;
        } catch (e) {
          return 'phantomjs';
        }
      },
      configurable: true,
      enumerable: true
    }
  });
};
