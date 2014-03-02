/*global describe, before, it*/
'use strict';
var assert  = require('assert');
var grunt = require('grunt');
var path = require('path');

var statici18n = require('../tasks/statici18n');
statici18n(grunt);

describe('beer', function() {
  it('is good', function() {
    assert.equal(statici18n.beer, 'good');
  });
});
