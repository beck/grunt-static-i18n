/*
 * statici18n
 * https://github.com/beck/grunt-static-i18n
 *
 * Copyright (c) 2014 Douglas Beck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function statici18n(grunt) {

  var options;

  var beer = 'good';
  statici18n.beer = beer;

  var plugin = function() {
    options = this.options({
      localeDir: 'locale',
    });

    this.files.forEach(function task(file) {
      file.src.map();
    });
  };

  var docstr = 'Grunt plugin to translate static assets.';
  grunt.registerMultiTask('statici18n', docstr, plugin);

};
