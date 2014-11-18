/*
 * grunt-fed
 * https://github.com/crossjs/grunt-fed
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  grunt.initConfig({

    fed: {
      task: {
        config: 'config.json'
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['fed']);

};
