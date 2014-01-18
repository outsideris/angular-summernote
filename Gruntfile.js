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
      },
      src: { src: 'src/**/*.js' },
      test: { src: 'test/**/*.test.js' }
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
      },
      travis: {
        singleRun: true,
        configFile: './test/karma.conf.js',
        browsers: ['PhantomJS']
      }
    },
    uglify: {
      deploy: {
        options: {
          mangle: false,
          banner: '/*\n' +
                  '  angular-summernote v<%=pkg.version%>\n' +
                  '  Copyright 2014 Jeonghoon Byun\n' +
                  '  License: MIT\n' +
                  ' */\n'
        },
        files: {
          'dist/angular-summernote.min.js': ['src/angular-summernote.js']
        }
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
  grunt.registerTask('travis', ['karma:travis']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('deploy', ['uglify:deploy']);
};
