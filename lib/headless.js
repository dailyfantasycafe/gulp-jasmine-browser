//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var path = require('path');
var childProcess = require('child_process');

var _require = require('./server');

var listen = _require.listen;

var portfinder = require('portfinder');
var promisify = require('es6-promisify');
var through = require('through2');

var getPort = promisify(portfinder.getPort);

/* eslint-disable no-unused-vars */
var DEFAULT_JASMINE_PORT = 8888;
/* eslint-enable no-unused-vars */

var drivers = {
  phantomjs: require('./drivers/phantomjs'),
  slimerjs: require('./drivers/slimerjs'),
  _default: require('./drivers/phantomjs')
};

function getServer(files, stream, callback) {
  var options = arguments[3] === undefined ? {} : arguments[3];

  var findOpenPort, _options$port, port;

  return _regeneratorRuntime.async(function getServer$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        findOpenPort = options.findOpenPort;
        _options$port = options.port;
        port = _options$port === undefined ? DEFAULT_JASMINE_PORT : _options$port;

        if (!findOpenPort) {
          context$1$0.next = 13;
          break;
        }

        context$1$0.prev = 4;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(getPort());

      case 7:
        port = context$1$0.sent;
        context$1$0.next = 13;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](4);

        callback(context$1$0.t0);

      case 13:
        listen(port, stream, files, callback, options);

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[4, 10]]);
}

function createServer(options) {
  var callback = arguments[1] === undefined ? null : arguments[1];

  var files = {};
  var stream = through.obj(function (file, encoding, done) {
    files[file.relative] = file.contents;
    if (stream.allowedToContinue) {
      done();
    }
    stream.next = function () {
      stream.allowedToContinue = true;
      done();
    };
  });
  stream.next = function () {
    stream.allowedToContinue = true;
  };

  getServer(files, stream, callback, options);

  return stream;
}

function headless() {
  var options = arguments[0] === undefined ? {} : arguments[0];

  options = _Object$assign({ findOpenPort: true }, options);
  var _options$driver = options.driver;
  var driver = _options$driver === undefined ? 'phantomjs' : _options$driver;

  var _drivers = drivers[driver in drivers ? driver : '_default']();

  var command = _drivers.command;
  var runner = _drivers.runner;
  var callback = _drivers.callback;

  var stream = createServer(options, function (server, port) {
    stream.on('end', function () {
      var phantomProcess = childProcess.spawn(command, [runner, port], {
        cwd: path.resolve(__dirname),
        stdio: 'pipe'
      });
      ['SIGINT', 'SIGTERM'].forEach(function (e) {
        return process.once(e, function () {
          return phantomProcess && phantomProcess.kill();
        });
      });
      callback(server, phantomProcess);
    });
  });
  return stream;
}

module.exports = {
  headless: headless,

  server: function server() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    return createServer(options);
  },

  slimerjs: function slimerjs() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    return headless(_Object$assign({}, options, { driver: 'slimerjs' }));
  },

  phantomjs: function phantomjs() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    return headless(_Object$assign({}, options, { driver: 'phantomjs' }));
  }
};