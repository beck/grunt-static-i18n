'use strict';
module.exports = function(grunt) {
  grunt.loadTasks('../../tasks');

  grunt.initConfig({
    statici18n: {
      options: {
        localeDir: 'app/locale'
      },
      translateFixtureApp: {
        files: [{
          expand: true,
          cwd: 'app',
          src: 'static/*.{js,json}',
          dest: 'app/i18n'
        }]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.registerTask('default', ['statici18n']);

};
