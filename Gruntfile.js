/*jshint node:true */
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 9999,
          base: ''
        }
      }
    },
    watch: {},
    karma: {
      'summernote': {
        configFile: './test/karma.conf.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) { grunt.loadNpmTasks(key); }
  }

  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('test', ['karma:summernote']);
  grunt.registerTask('lint', ['jshint']);
};
