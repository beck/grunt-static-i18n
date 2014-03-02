/*
 * statici18n
 * https://github.com/beck/grunt-static-i18n
 *
 * Copyright (c) 2014 Douglas Beck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function statici18n(grunt) {
  var path = require('path');

  var options;

  var save = function(file, lang, content) {
    var langDir = path.join(file.orig.dest, lang);
    var dest = file.dest.replace(file.orig.dest, langDir);
    grunt.file.write(dest, content);
    grunt.log.writeln('File "' + dest + '" created.');
  };

  var saveEachTranslation = function() {
    var file = this; // passed via map
    var locales = ['fr'];
    var translated = { 'fr': 'lol' };
    locales.forEach(function(lang) {
      save(file, lang, translated[lang]);
    });
  };

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
        .filter(exists)
        .map(saveEachTranslation, file);
    });
  };

  var docstr = 'Grunt plugin to translate static assets.';
  grunt.registerMultiTask('statici18n', docstr, plugin);

};
