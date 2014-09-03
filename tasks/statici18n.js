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
  var locales;

  var save = function(file, content, lang) {
    lang = lang || '';
    var langDir = path.join(file.orig.dest, lang);
    var dest = file.dest.replace(file.orig.dest, langDir);
    grunt.file.write(dest, content);
    grunt.log.writeln('File "' + dest + '" created.');
  };
  statici18n.save = save;

  var saveEachTranslation = function(translated) {
    var file = this; // passed via map
    locales.forEach(function(lang) {
      save(file, translated[lang], lang);
    });
    save(file, translated._default);
  };

  var loadTranslations = function() {
    locales.forEach(function readPo(lang) {
      var po = path.join(
        statici18n.options.localeDir, lang, 'LC_MESSAGES',
        statici18n.options.textDomain + '.po'
      );
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
      cwd: statici18n.options.localeDir
    }, '*');

    if (!locales.length) {
      grunt.fail.warn('Unable to find any languages in locale directory.');
    }

    var index = locales.indexOf('template');
    if (index > -1) {
      locales.splice(index, 1);
    }
    return locales;
  };
  statici18n.getLocales = getLocales;

  var gettext = function(msgid) {
    var text = gt.gettext(msgid);
    var lang = gt.textdomain();
    grunt.verbose.writeln('Gettext', lang, msgid, text);
    if (gt.quoteText) {
      text = '"' + text.replace(/"/, '\"') + '"';
    }
    return text;
  };

  var compileTemplate = function(filepath) {
    var compiled;
    _.templateSettings = statici18n.options.template;
    try {
      compiled = _.template(grunt.file.read(filepath));
    } catch (e) {
      grunt.log.warn(
        'Failed to translate (probably an issue with quotes):',
        filepath, e.message, '\nSource:\n\n', e.source
      );
      return false;
    }
    try {
      compiled();
    } catch (e) {
      grunt.log.warn(
        'Failed to compile: ', filepath,
        '\nIf template is over 900kb, must bump node’s stack size.\nError:', e
      );
      return false;
    }
    return compiled;
  };

  var translate = function(filepath) {
    var translated = false;
    // json files do not require gettext to return quoted translations
    gt.quoteText = path.extname(filepath) !== '.json';
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

    // add a language free default
    gt.textdomain('_default');
    translated._default = compiled();

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
    statici18n.options = this.options({
      localeDir: 'locale',
      template: {
        interpolate: /(_\((?:'[^']+?'|"[^"]+")\))/g,
        imports: { '_': gettext }
      },
      textDomain: 'messages'
    });

    locales = getLocales();
    loadTranslations();

    if (!this.files.length) {
      grunt.log.warn('No files provided for translation.');
    }

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
