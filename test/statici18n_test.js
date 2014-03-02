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
    var readme = path.join(__dirname, '..', 'README.md');
    assert.ok(statici18n.exists(readme));
  });
});
