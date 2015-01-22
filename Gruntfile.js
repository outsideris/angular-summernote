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
      options: {
        configFile: './test/karma.conf.js'
      },
      'summernote': { },
      'summernote-angular-12': {
        configFile: './test/karma-angular-1-2-x.conf.js'
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage'],
        preprocessors: { '../**/src/**/*.js': 'coverage' },
        coverageReporter: { type: 'lcov', dir: '../coverage/' },
        plugins: [ 'karma-*' ]
      }
    },
    concat: {
      deploy: {
        src: ['src/angular-summernote.js'],
        dest: 'dist/angular-summernote.js'
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
    },
    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage',
        dryRun: false,
        force: true,
        recursive: true
      }
    },
    compress: {
      main: {
        options: {
          archive: 'dist/<%= pkg.version %>.tar.gz',
          mode: 'tgz'
        },
        files: [
          {src: ['dist/*.js'], dest: '', filter: 'isFile'}
        ]
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
  grunt.registerTask('travis', ['karma:travis', 'coveralls']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('deploy', ['concat:deploy', 'uglify:deploy']);
};
