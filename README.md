# gulp-jasmine-browser
[![Build Status](https://travis-ci.org/jasmine/gulp-jasmine-browser.svg?branch=master)](https://travis-ci.org/jasmine/gulp-jasmine-browser)

## Installing
`gulp-jasmine-browser` is available as an
[npm package](https://www.npmjs.com/package/gulp-jasmine-browser).

## Usage

### Create a Jasmine server to run specs in a browser

In `gulpfile.js`

```js
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('jasmine', function() {
  return gulp.src(['src/**/*.js', 'spec/**/*_spec.js'])
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});
```
In `gulp.src` include all files you need for testing other than jasmine itself.
This should include your spec files, and may also include your production JavaScript and
CSS files.

The jasmine server will run on the `port` given to `server`, or will default to port 8888.

### Watching for file changes

To have the server automatically refresh when files change, you will want something like [gulp-watch](https://github.com/floatdrop/gulp-watch).

```js
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var watch = require('gulp-watch')

gulp.task('jasmine', function() {
  var filesForTest = ['src/**/*.js', 'spec/**/*_spec.js'] 
  return gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});
```

If you are using Webpack or Browserify, you may want to use their watching mechanisms instead of this example.

### Run jasmine tests headlessly

In `gulpfile.js`

For PhantomJs
```js
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('jasmine-phantom', function() {
  return gulp.src(['src/**/*.js', 'spec/**/*_spec.js'])
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());
});
```

To use this driver, the PhantomJS npm [package](https://www.npmjs.com/package/phantomjs) must be installed in your project.

GulpJasmineBrowser assumes that if the package is not installed `phantomjs` is already installed and in your path.
It is only tested with PhantomJS 2.

For SlimerJs
```js
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('jasmine-phantom', function() {
  return gulp.src(['src/**/*.js', 'spec/**/*_spec.js'])
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless({driver: 'slimerjs'}));
});
```

To use this driver, the SlimerJS npm [package](https://www.npmjs.com/package/slimerjs) must be installed in your project.

Note the `{console: true}` passed into specRunner.



### Usage with Webpack

If you would like to compile your front end assets with Webpack, for example to use
commonjs style require statements, you can pipe the compiled assets into
GulpJasmineBrowser.

In `gulpfile.js`

```js
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var webpack = require('webpack-stream');

gulp.task('jasmine', function() {
  return gulp.src('spec/**/*_spec.js'])
    .pipe(webpack({watch: true, output: {filename: 'spec.js'}}))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server());
});
```

When using webpack, it is helpful to delay the jasmine server when the webpack bundle becomes invalid (to prevent serving
javascript that is out of date).  Adding the plugin to your webpack configuration, and adding the whenReady function to
the server configuration enables this behavior. 

```js
var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var webpack = require('webpack-stream');

gulp.task('jasmine', function() {
  var JasminePlugin = require('gulp-jasmine-browser/webpack/jasmine-plugin');
  var plugin = new JasminePlugin();
  return gulp.src('spec/**/*_spec.js'])
    .pipe(webpack({watch: true, output: {filename: 'spec.js'}, plugins: [plugin]}))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({whenReady: plugin.whenReady}));
});
```

## Development
### Getting Started
The application requires the following external dependencies:
* [Node](https://nodejs.org/)
* [Gulp](http://gulpjs.com/)
* [PhantomJS](http://phantomjs.org/) - if you want to run tests with Phantom, see your options under 'Usage.'

The rest of the dependencies are handled through:
```bash
npm install
```

Run tests with:
```bash
npm test
```

(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
