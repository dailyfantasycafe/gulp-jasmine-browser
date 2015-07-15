//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var headless = require('./lib/headless');
var through = require('through2');
var SpecRunner = require('./lib/spec_runner');

module.exports = _Object$assign({
  specRunner: function specRunner(options) {
    var specRunner = new SpecRunner(options);
    return through.obj(function (file, encoding, callback) {
      this.push(file);
      this.push(specRunner.addFile(file.relative));
      callback();
    });
  }
}, headless);