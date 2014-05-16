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

    clean: ['coverage'],

    copy: {
      coverage: {
        src: ['test/**'],
        dest: 'coverage/'
      }
    },

    blanket: {
      coverage: {
        src: ['tasks/'],
        dest: 'coverage/tasks/'
      }
    },

    mochaTest: {
      'spec': {
        options: {
          reporter: 'spec',
        },
        src: ['coverage/test/**/*-spec.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['coverage/test/**/*-spec.js']
      },
      'mocha-lcov-reporter': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'coverage/lcov.info'
        },
        src: ['coverage/test/**/*-spec.js']
      }
    },

    coveralls: {
      options: {
        debug: true,
        coverage_dir: 'coverage',
        dryRun: false,
        force: true
      }
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
      testAppCatalogs: {
        options: {
          template: '<%= xgettext.options.potFile %>',
          languages: ['pt-br', 'fr'],  // fancy, changes to locales on create
          localeDir: 'test/fixtures/app/locale',
        }
      }
    },

    abideMerge: {
      testAppPoFiles: {
        options: {
          template: '<%= xgettext.options.potFile %>',
          localeDir: '<%= abideCreate.testAppCatalogs.options.localeDir %>',
        }
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // helper task for creating fixture locale
  grunt.registerTask('makemessages', [
    'xgettext', 'abideCreate', 'abideMerge'
  ]);
  grunt.registerTask('test', [
    'clean', 'blanket', 'copy', 'mochaTest'
  ]);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('ci', ['jshint', 'test', 'coveralls']);

};
