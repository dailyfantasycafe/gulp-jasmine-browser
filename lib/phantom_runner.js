//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var system = require('system');
var webPage = require('webpage');
var args = system.args;

var port = args[1] || 8888;

var page = webPage.create();
page.onConsoleMessage = function (message) {
  system.stdout.write(message);
};
page.onCallback = function (json) {
  var result = JSON.parse(json);
  phantom.exit(result.success ? 0 : 1);
};

page.open('http://localhost:' + port);