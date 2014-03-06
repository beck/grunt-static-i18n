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

    clean: ['test/fixtures/app/i18n', 'coverage'],

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
        src: ['coverage/test/**/*.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['coverage/test/**/*.js']
      },
      'mocha-lcov-reporter': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'coverage/lcov.info'
        },
        src: ['coverage/test/**/*.js']
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
      options: {
        template: '<%= xgettext.options.potFile %>',
        languages: ['en-gb', 'fr'],  // fancy, changes to locales on create
        localeDir: 'test/fixtures/app/locale',
      }
    },

    statici18n: {
      options: {
        localeDir: '<%= abideCreate.options.localeDir %>'
      },
      translateFixtureApp: {
        files: [{
          expand: true,
          cwd: 'test/fixtures/app',
          src: 'static/*.json',
          dest: 'test/fixtures/app/i18n'
        }]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // helper task for creating fixture locale
  grunt.registerTask('makemessages', ['xgettext', 'abideCreate']);

  grunt.registerTask('default', [
    'clean', 'clean', 'statici18n', 'blanket', 'copy', 'mochaTest'
  ]);
  grunt.registerTask('ci', ['jshint', 'default', 'coveralls']);

};
