/* global require */
'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var dirtyChai = require('dirty-chai');
var isStream = require('isstream');
var cssLint = require('gulp-csslint');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var handyman = require('pipeline-handyman');

var validateCSSPipeline = require('../src/index');

chai.use(sinonChai);
chai.use(dirtyChai);

describe('pipeline-validate-css', function () {
  var nodePath;

  before(function (done) {
    /*
     To mimic an environment in which this pipeline will be used,
     it's necessary to have a "node_modules/pipeline-validate-css/" directory with a .csslintrc file.
     To ensure this file exists, a simple stream is used to generate the file in
     the appropriate location.
     */

    var localPath = path.join(process.cwd());

    nodePath = path.join(process.cwd(), 'node_modules/pipeline-validate-css/');

    if (!fs.existsSync(nodePath)) {
      fs.mkdirSync(nodePath);
    }

    fs.createReadStream(localPath + '/.csslintrc')
      .pipe(fs.createWriteStream(nodePath + '/.csslintrc'))
      .on('finish', done);
  });

  after(function () {
    /*
     Delete temporary pipeline-validate-css directory after testing is complete.
     */
    if (fs.existsSync(nodePath)) {
      rimraf.sync(nodePath);
    }
  });

  describe('validateCSS Method', function () {

    it('should expose a validateCSS method', function () {
      expect(validateCSSPipeline.validateCSS).to.exist();
      expect(validateCSSPipeline.validateCSS).to.be.a('function');
    });

    it('should return a stream object', function () {
      expect(validateCSSPipeline.validateCSS()).to.be.an('object');
      expect(isStream(validateCSSPipeline.validateCSS())).to.be.true();
    });

    it('should ensure that the custom output formatter is used', function () {
      var spy = sinon.spy(cssLint, 'formatter');

      validateCSSPipeline.validateCSS();

      expect(spy).to.have.been.calledWith(sinon.match.object);

      cssLint.formatter.restore();
    });

    describe('validateCSS default usage', function () {

      /*
        @TODO Enable test when able to
        https://github.com/kenzanlabs/pipeline-validate-css/issues/28

        The hope here was to spy on the default method of gulp-csslint
        to ensure that it was part of the stream process. Unfortunately,
        it seems impossible to spy on the default method using require().
        However, when moving to ES6 and the import statement there may be a possibility
        that spying would be possible.
      */
      xit('should utilize cssLint with no options', function () {
        /*
         The hope here was to spy on the default method of gulp-csslint
         to ensure that it was part of the stream process. Unfortunately,
         it seems impossible to spy on the default method using require().
         However, when moving to ES6 and the import statement there may be a possibility
         that spying would be possible.
         */
        var spy = sinon.spy(cssLint);

        validateCSSPipeline.validateCSS();

        expect(spy).to.have.been.calledWith(sinon.match.undefined);
      });

    });

    describe('validateCSS provided a custom options object', function () {

      var customConfig;

      beforeEach(function () {
        customConfig = {
          important: false
        };
      });

      it('should merge the provided options with the default options', function () {
        var spy = sinon.spy(handyman, 'mergeConfig');

        validateCSSPipeline.validateCSS(customConfig);

        expect(spy).to.have.been.calledWith(sinon.match.object, customConfig);

        handyman.mergeConfig.restore();
      });

      /*
        @TODO Enable test when able to
        https://github.com/kenzanlabs/pipeline-validate-css/issues/28
      */
      xit('should utilize cssLint with the provided options object', function () {
        /*
         Same issue here with spying on gulp-csslint
         */
        var spy = sinon.spy(cssLint);

        validateCSSPipeline.validateCSS();

        expect(spy).to.have.been.calledWith(customConfig);
      });

    });

    describe('validateCSS provided a custom .csslintrc path', function () {

      it('should throw an error when the provided file path can not be found', function () {
        var path = './test/path/that/does/not/exist/.mockcsslintrc';
        var fn = function () {
          validateCSSPipeline.validateCSS(path);
        };

        expect(fn).to.throw();
      });

      it('should merge the default config with the file at the provided path', function () {
        var spy = sinon.spy(handyman, 'mergeConfig');
        var path = './test/fixtures/.mockcsslintrc';

        validateCSSPipeline.validateCSS(path);

        expect(spy).to.have.been.calledWith(sinon.match.object, sinon.match.object);
        expect(spy.getCall(0).args[0].important).to.be.true();
        expect(spy.getCall(0).args[1].important).to.be.false();
      });

    });

  });

});
