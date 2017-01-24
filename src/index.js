/* global require, module */
'use strict';

var cssLint = require('gulp-csslint');
var handyman = require('pipeline-handyman');
var lazypipe = require('lazypipe');
var fs = require('fs');
var path = require('path');
var stylish = require('csslint-stylish');

module.exports = {
  validateCSS: function (options) {
    var config = generatePipelineOptions(options);

    return pipelineFactory(config);
  }
};

function pipelineFactory (config) {
  var stream;

  stream = lazypipe()
    .pipe(cssLint, config)
    .pipe(cssLint.formatter, stylish);

  return stream();
}

function generatePipelineOptions (options) {
  var config;
  var defaultConfig;
  var providedConfig;

  defaultConfig = fs.readFileSync(path.join(process.cwd(), '.csslintrc'), 'utf8');
  defaultConfig = JSON.parse(defaultConfig.toString());

  if (typeof options === 'object') {
    config = handyman.mergeConfig(defaultConfig, options);

  } else if (typeof options === 'string') {

    try {
      providedConfig = fs.readFileSync(options, 'utf8');
      providedConfig = JSON.parse(providedConfig.toString());

      config = handyman.mergeConfig(defaultConfig, providedConfig);

    } catch (ex) {
      throw new Error('pipeline-validate-css: Provided path to .csslintrc failed. Please check the path.');

    }

  } else {
    config = defaultConfig;

  }

  return config;
}