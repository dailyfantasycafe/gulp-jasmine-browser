//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _WeakMap = require('babel-runtime/core-js/weak-map')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var privates = new _WeakMap();

var JasminePlugin = (function () {
  function JasminePlugin() {
    _classCallCheck(this, JasminePlugin);

    var resolve = function resolve() {};
    var reject = function reject() {};
    var promise = new _Promise(function (res, rej) {
      resolve = res;
      reject = rej;
    });

    privates.set(this, { promise: promise, resolve: resolve, reject: reject });

    this.whenReady = (function () {
      return privates.get(this).promise;
    }).bind(this);
  }

  _createClass(JasminePlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('invalid', function () {
        var _privates$get = privates.get(_this);

        var resolve = _privates$get.resolve;
        var reject = _privates$get.reject;
        var promise = _privates$get.promise;

        reject();
        promise = new _Promise(function (res, rej) {
          resolve = res;
          reject = rej;
        });
        privates.set(_this, { promise: promise, resolve: resolve, reject: reject });
        return promise;
      });
      compiler.plugin('done', function () {
        return privates.get(_this).resolve();
      });
    }
  }]);

  return JasminePlugin;
})();

module.exports = JasminePlugin;