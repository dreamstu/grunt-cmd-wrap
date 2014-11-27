/*
 * grunt-cmd-wrap
 * https://github.com/crossjs/grunt-cmd-wrap
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  grunt.registerMultiTask('cmd-wrap', 'run cmd-wrap with grunt.', function () {

    this.async();

    return require('../lib/wrap')(this.data);

  });

};
