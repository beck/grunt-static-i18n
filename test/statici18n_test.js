/*global describe, before, it*/
'use strict';
var assert  = require('assert');
var grunt = require('grunt');
var path = require('path');

var statici18n = require('../tasks/statici18n');
statici18n(grunt);

describe('exists', function() {
  it('returns false with fake file', function() {
    assert.equal(false, statici18n.exists('some/fake/file.txt'));
  });
  it('returns true with some real file', function() {
    var readme = path.join(__dirname, '..', 'README.md');
    assert.ok(statici18n.exists(readme));
  });
});
