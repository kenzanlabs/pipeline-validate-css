THIS IT JUST A TEST# pipeline-validate-css

## Information

| Package       | Description   | Version|
| ------------- |:-------------:| -----:|
| pipeline-validate-css| This pipeline validates CSS files using CSS Lint| 1.1.0 |

# Overview

A pipeline for validating CSS files using CSS Lint.

## Install

`npm install pipeline-validate-css --save-dev`

## Usage
```javascript
var gulp = require('gulp');
var validateCssPipeline = require('pipeline-validate-css');


gulp.task('validate:css', function() {
  return gulp
    .src(['src/**/*.css'])
    .pipe(validateCssPipeline.validateCSS());
});
```

## Options

  + You can include your custom CSS rules adding a `.csslintrc` file in the root of your project. Using this method will overwrite the default rules predefined in this pipeline.

## Results

This pipeline returns an object. This object receives a stream with the CSS files to validate. You can call the _validateCSS_ method to run the validation. The method will report if any issues were found during the process . If no issues are present, it will return the stream.

## LICENSE

Copyright (c) 2015 Kenzan <http://kenzan.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
