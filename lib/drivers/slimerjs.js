//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Object$defineProperties = require('babel-runtime/core-js/object/define-properties')['default'];

var es = require('event-stream');
module.exports = function () {
  return _Object$defineProperties({
    runner: 'slimer_runner.js',
    callback: function callback(server, phantomProcess) {
      phantomProcess.stdout.pipe(es.wait(function (err, body) {
        if (err) process.exit(err);

        var _JSON$parse = JSON.parse(body);

        var success = _JSON$parse.success;
        var buffer = _JSON$parse.buffer;

        console.log(buffer);
        process.exit(success ? 0 : 1);
      }));
    }
  }, {
    command: {
      get: function () {
        try {
          return require('slimerjs').path;
        } catch (e) {
          return 'slimerjs';
        }
      },
      configurable: true,
      enumerable: true
    }
  });
};