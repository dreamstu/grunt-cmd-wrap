/*
 * grunt-cmd-wrap
 * https://github.com/crossjs/grunt-cmd-wrap
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  grunt.initConfig({

    'cmd-wrap': {
      proxy: {
        dest: 'app',
        port: 8000
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['cmd-wrap']);

};
