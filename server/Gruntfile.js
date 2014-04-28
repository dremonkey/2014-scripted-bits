'use strict';

var path, paths;

path = require('path');

// ## Directory and File Path Configurations

paths = {

  server: {
    tld: __dirname,
    files: {
      scripts: [
        '<%= paths.server.tld %>/**/*.js',
        '!<%= paths.server.tld %>/node_modules/**/*.js'
      ]
    }
  },

  heroku: {
    tld: path.normalize(__dirname + '../../_heroku'),
    dirs: {
      server: '<%= paths.heroku.tld %>/server'
    }
  },

  azure: {
    tld: path.normalize(__dirname + '../../_azure'),
    dirs: {
      server: '<%= paths.azure.tld %>/server'
    }
  }
};

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // ## Define the configuration for all the tasks

  grunt.initConfig({

    paths: paths,

    watch: {
      express: {
        files: [
          'server.js',
          'gravatar/**/*.js',
          'middleware/**/*.js',
          'routes/**/*.js'
        ],
        tasks:  ['express:dev']
      },
      options: {
        //Without this option the specified express won't be reloaded
        nospawn: true
      }
    },

    express: {
      // jshint camelcase:false
      options: {
        script: '<%= paths.server.tld %>/server.js',
        port: 3000
      },
      dev: {
        options: {
          node_env: 'development',
          debug: true
        }
      },
      dist: {
        options: {
          node_env: 'production'
        }
      }
    },

    copy: {

      // Copy files from server -> _heroku/server
      heroku: {
        files: [{
          expand: true,
          cwd: '<%= paths.server.tld %>',
          src: [
            'config.js',
            'config/*.js',
            'gravatar/*.js',
            'middleware/*.js',
            'routes/*.js',
            'server.js',
            'utils/*.js'
          ],
          dest: '<%= paths.heroku.dirs.server %>',
        }]
      },

      // Copy files from server -> _azure/server
      azure: {
        files: [{
          expand: true,
          cwd: '<%= paths.server.tld %>',
          src: [
            'config.js',
            'config/*.js',
            'gravatar/*.js',
            'middleware/*.js',
            'routes/*.js',
            'server.js',
            'utils/*.js'
          ],
          dest: '<%= paths.azure.dirs.server %>',
        }]
      },
    },

    // Automatically open browser
    open: {
      all: {
        path: 'http://127.0.0.1:<%= express.options.port %>'
      }
    },

    // Check javascript for errors
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= paths.server.files.scripts %>'
      ]
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  // ## Register all Grunt Tasks

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'express:dist',
        'open'
      ]);
    }

    grunt.task.run([
      'newer:jshint:all',
      'build',
      'express:dev',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', []);

  grunt.registerTask('azure', [
    'newer:jshint:all',
    'build',
    'copy:azure'
  ]);

  grunt.registerTask('heroku', [
    'newer:jshint:all',
    'build',
    'copy:heroku'
  ]);
};
