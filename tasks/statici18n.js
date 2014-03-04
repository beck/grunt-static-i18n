/*
 * statici18n
 * https://github.com/beck/grunt-static-i18n
 *
 * Copyright (c) 2014 Douglas Beck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function statici18n(grunt) {
  var _ = require('lodash-node');
  var fs = require('fs');
  var path = require('path');
  var Gettext = require('node-gettext');

  var gt = new Gettext();
  var options, locales;

  var save = function(file, lang, content) {
    var langDir = path.join(file.orig.dest, lang);
    var dest = file.dest.replace(file.orig.dest, langDir);
    grunt.file.write(dest, content);
    grunt.log.writeln('File "' + dest + '" created.');
  };
  statici18n.save = save;

  var saveEachTranslation = function(translated) {
    var file = this; // passed via map
    locales.forEach(function(lang) {
      save(file, lang, translated[lang]);
    });
  };

  var loadTranslations = function() {
    locales.forEach(function readPo(lang) {
      var po = path.join(options.localeDir, lang, 'LC_MESSAGES', 'messages.po');
      if (!grunt.file.exists(po)){
        grunt.log.warn('Translations not found: ' + po);
        return;
      }
      var content = fs.readFileSync(po);
      gt.addTextdomain(lang, content);
    });
  };

  var getLocales = function() {
    var locales = grunt.file.expand({
      filter: 'isDirectory',
      cwd: options.localeDir
    }, '*');
    if (!locales.length) {
      grunt.fail.warn('Unable to find any languages in locale directory.');
    }
    locales.pop('template');
    return locales;
  };

  var gettext = function(msgid) {
    var text = gt.gettext(msgid);
    var lang = gt.textdomain();
    grunt.verbose.writeln('Gettext', lang, msgid, text);
    return text;
  };

  var compileTemplate = function(filepath) {
    var compiled;
    _.templateSettings = options.template;
    try {
      return compiled = _.template(grunt.file.read(filepath));
    } catch (e) {
      grunt.log.warn(
        'Failed to translate (probably an issue with quotes):',
        filepath, e.message, '\nSource:\n\n', e.source
      );
      return false;
    }
  };

  var translate = function(filepath) {
    var translated = false;
    var compiled = compileTemplate(filepath);
    if (!compiled) {
      return false;
    }
    translated = {};
    locales.forEach(function addTranslation(lang) {
      // node-gettext repurposes and confuses the term "domain".  gross
      gt.textdomain(lang);
      translated[lang] = compiled();
    });
    return translated;
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
      template: {
        interpolate: /(_\((?:'[^']+?'|"[^"]+")\))/g,
        imports: { '_': gettext }
      }
    });

    locales = getLocales();
    loadTranslations();

    this.files.forEach(function task(file) {
      file.src
        .filter(exists)
        .map(translate)
        .filter(_.isObject)
        .map(saveEachTranslation, file);
    });
  };

  var docstr = 'Grunt plugin to translate static assets.';
  grunt.registerMultiTask('statici18n', docstr, plugin);

};
