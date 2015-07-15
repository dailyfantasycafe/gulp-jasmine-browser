//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var express = require('express');
var mime = require('mime');
var path = require('path');
var favicon = require('serve-favicon');

function log(message) {
  try {
    var _require = require('gulp-util');

    var log = _require.log;

    log(message);
  } catch (e) {
    console.log(message);
  }
}

function renderFile(res, files, pathname, whenReady) {
  whenReady().then(function () {
    var contents;
    if (pathname && (contents = files[pathname])) {
      res.status(200).type(mime.lookup(pathname)).send(contents.toString());
      return;
    }
    res.status(404).send('File not Found');
  }, function () {
    renderFile(res, files, pathname, whenReady);
  });
}

var Server = {
  createServer: function createServer(files) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    var app = express();

    app.use(favicon(path.join(__dirname, '..', 'public', 'jasmine_favicon.png')));

    app.get('/', function (req, res) {
      var _options$whenReady = options.whenReady;
      var whenReady = _options$whenReady === undefined ? function () {
        return _Promise.resolve();
      } : _options$whenReady;

      renderFile(res, files, 'specRunner.html', whenReady);
    });

    app.get('*', function (req, res) {
      var _options$whenReady2 = options.whenReady;
      var whenReady = _options$whenReady2 === undefined ? function () {
        return _Promise.resolve();
      } : _options$whenReady2;

      var filePath = req.path.replace(/^\//, '');
      var pathname = path.normalize(filePath);
      renderFile(res, files, pathname, whenReady);
    });

    return app;
  },

  listen: function listen(port, stream, files, callback) {
    var options = arguments[4] === undefined ? {} : arguments[4];

    var server = Server.createServer(files, options).listen(port, function () {
      log('Jasmine server listening on port ' + port);
      callback && callback(server, port);
      stream.next();
    });
    return server;
  }
};

module.exports = Server;