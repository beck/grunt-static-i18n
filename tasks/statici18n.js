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

  var exists = function(filepath) {
    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return false;
    } else {
      return true;
    }
  };
  statici18n.exists = exists;

  var plugin = function() {
    options = this.options({
      localeDir: 'locale',
    });

    this.files.forEach(function task(file) {
      file.src
        .filter(exists);
    });
  };

  var docstr = 'Grunt plugin to translate static assets.';
  grunt.registerMultiTask('statici18n', docstr, plugin);

};
