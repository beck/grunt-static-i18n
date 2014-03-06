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
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['coverage/test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['coverage/test/**/*.js']
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
  grunt.registerTask('makemessages', ['xgettext', 'abideCreate']);

  grunt.registerTask('unitTest', [
    'clean', 'clean', 'statici18n', 'blanket', 'copy', 'mochaTest'
  ]);

  // 'test' is for travis, 'default' is for local
  grunt.registerTask('test', ['jshint', 'unitTest']);
  grunt.registerTask('default', 'unitTest');

};
