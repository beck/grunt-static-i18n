/*global after, before, describe, it*/
'use strict';
var assert  = require('assert');
var grunt = require('grunt');
var path = require('path');
var sinon = require('sinon');

var statici18n = require('../tasks/statici18n');
statici18n(grunt);

describe('exists', function() {

  after(function() {
    grunt.log.warn.restore();
  });

  it('should nag and filter if the file is missing', function() {
    sinon.stub(grunt.log, 'warn');
    assert.equal(false, statici18n.exists('some/fake/file.txt'));
    sinon.assert.calledOnce(grunt.log.warn);
  });

  it('returns true with some real file', function() {
    var readme = path.join(__dirname, 'fixtures/app/static/data.json');
    assert.ok(statici18n.exists(readme));
  });

});

describe('save', function() {

  before(function() {
    sinon.stub(grunt.log, 'writeln');
    sinon.stub(grunt.file, 'write');
    var file = {
      dest: 'dest/file.txt',
      orig: { 'dest': 'dest' }
    };
    statici18n.save(file, 'content', 'es');
  });

  after(function() {
    grunt.file.write.restore();
    grunt.log.writeln.restore();
  });

  it('should call grunt.write', function() {
    sinon.assert.calledOnce(grunt.file.write);
  });

  it('should add lang to destination', function() {
    sinon.assert.calledWith(grunt.file.write, 'dest/es/file.txt', 'content');
  });

});

describe('static i18n', function() {

  before(function(done) {
    var ChildProcess = require('cover-child-process').ChildProcess;
    var Blanket = require('cover-child-process').Blanket;
    var childProcess = new ChildProcess(new Blanket());
    var gruntExec = 'node ' + path.resolve('node_modules/.bin/grunt');
    var fixtures = path.join(__dirname, 'fixtures');
    childProcess.exec(gruntExec, {cwd: fixtures},  done);
  });

  describe('of json files', function() {

    var i18n = path.join(__dirname, 'fixtures', 'app', 'i18n');
    var fr = path.join(i18n, 'fr', 'static', 'data.json');
    var pt = path.join(i18n, 'pt_BR', 'static', 'data.json');
    var def = path.join(i18n, 'static', 'data.json');

    it('should create a file for each language', function() {
      assert.ok(grunt.file.exists(fr), 'Not found: ' + fr);
      assert.ok(grunt.file.exists(pt), 'Not found: ' + pt);
    });

    it('should create a non-language default', function() {
      assert.ok(grunt.file.exists(def), 'Not found: ' + def);
    });

    it('should not translate the default', function() {
      assert.equal('["Hello World"]\n', grunt.file.read(def));
    });

    it('should translate french', function() {
      assert.equal('["Bonjour tout le monde"]\n', grunt.file.read(fr));
    });

    it('should translate english', function() {
      assert.equal('["Olá mundo"]\n', grunt.file.read(pt));
    });

  });

  describe('of javascript files', function() {

    var i18n = path.join(__dirname, 'fixtures', 'app', 'i18n');
    var fr = path.join(i18n, 'fr', 'static', 'script.js');
    var pt = path.join(i18n, 'pt_BR', 'static', 'script.js');
    var def = path.join(i18n, 'static', 'script.js');

    it('should create a file for each language', function() {
      assert.ok(grunt.file.exists(fr), 'Not found: ' + fr);
      assert.ok(grunt.file.exists(pt), 'Not found: ' + pt);
    });

    it('should create a non-language default', function() {
      assert.ok(grunt.file.exists(def), 'Not found: ' + def);
    });

    it('should not translate the default', function() {
      assert.equal('"Hello World";\n', grunt.file.read(def));
    });

    it('should translate french', function() {
      assert.equal('"Bonjour tout le monde";\n', grunt.file.read(fr));
    });

    it('should translate english', function() {
      assert.equal('"Olá mundo";\n', grunt.file.read(pt));
    });

  });

});
