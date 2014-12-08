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
        base: 'tests',
        // server listening port
        port: 8000
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['wrap']);

};
