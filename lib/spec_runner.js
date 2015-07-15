//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _WeakMap = require('babel-runtime/core-js/weak-map')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var jasmineCore = require('jasmine-core');

function resolveJasmineFiles(directoryProp, fileNamesProp) {
  var directory = jasmineCore.files[directoryProp];
  var fileNames = jasmineCore.files[fileNamesProp];
  return fileNames.map(function (fileName) {
    return path.resolve(directory, fileName);
  });
}

var inlineTagExtensions = { '.css': 'style', '.js': 'script' };

var privates = new _WeakMap();

var SpecRunner = (function (_File) {
  function SpecRunner() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SpecRunner);

    _get(Object.getPrototypeOf(SpecRunner.prototype), 'constructor', this).call(this, { path: '/specRunner.html', base: '/' });

    this.contents = new Buffer('<!DOCTYPE html>');
    privates.set(this, { files: new _Set() });

    var files = [].concat(resolveJasmineFiles('path', 'cssFiles'), resolveJasmineFiles('path', 'jsFiles'), options.console ? ['console.js', 'console_boot.js'] : resolveJasmineFiles('bootDir', 'bootFiles'));
    files.forEach(function (fileName) {
      return _this.inlineFile(fileName);
    });
  }

  _inherits(SpecRunner, _File);

  _createClass(SpecRunner, [{
    key: 'inlineFile',
    value: function inlineFile(filePath) {
      var fileContents = fs.readFileSync(path.resolve(__dirname, filePath), { encoding: 'utf8' });
      var fileExtension = inlineTagExtensions[path.extname(filePath)];

      this.contents = Buffer.concat([this.contents, new Buffer('<' + fileExtension + '>' + fileContents + '</' + fileExtension + '>')]);
      return this;
    }
  }, {
    key: 'addFile',
    value: function addFile(filePath) {
      var _privates$get = privates.get(this);

      var files = _privates$get.files;

      if (files.has(filePath)) return this;
      files.add(filePath);

      var fileExtension = path.extname(filePath);

      var html = '';
      if (fileExtension === '.js') {
        html = '<script src="' + filePath + '"></script>';
      } else if (fileExtension === '.css') {
        html = '<link href="' + filePath + '" rel="stylesheet" type="text/css"></link>';
      }

      this.contents = Buffer.concat([this.contents, new Buffer(html)]);

      return this;
    }
  }]);

  return SpecRunner;
})(File);

module.exports = SpecRunner;