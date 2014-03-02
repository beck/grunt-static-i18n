/*
 * statici18n
 * https://github.com/beck/grunt-static-i18n
 *
 * Copyright (c) 2014 Douglas Beck
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    simplemocha: {
      options: {
        reporter: 'spec'
      },
      all: { src: ['test/**/*_test.js'] }
    },

    // abideExtract is limited by the parsers used in jsxgettext
    // grunt-xgettext works on text because it regexs the source
    xgettext: {
      options: {
        functionName: '_',
        potFile: 'test/fixtures/app/locale/template/messages.pot',
      },
      fixtureJSON: {
        files: {
          javascript: ['test/fixtures/app/**/*.json'],
        },
      }
    },

    abideCreate: {
      fixture: {
        options: {
          template: '<%= xgettext.options.potFile %>',
          languages: ['en-gb', 'fr'],  // fancy, changes to locales on create
          localeDir: 'test/fixtures/app/locale',
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('makemessages', [
    'xgettext', 'xgettext', 'abideCreate'
  ]);
  grunt.registerTask('test', ['simplemocha']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
