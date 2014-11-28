/*
 * grunt-cmd-wrap
 * https://github.com/crossjs/grunt-cmd-wrap
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    wrap: {
      server: {
        // base directory
        dest: '.',
        // server listening port
        port: 8080,
        // files to be wrapped
        wrap: function(url) {
          return /^\/Gruntfile\.js$/.test(url);
        }
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['wrap']);

};
