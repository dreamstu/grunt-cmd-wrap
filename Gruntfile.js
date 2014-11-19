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
        // target folder relative to `process.cwd()`
        dest: '',
        // server listening port
        port: 8000,
        // url prefix to be trimed
        pref: '/static'
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['cmd-wrap']);

};
