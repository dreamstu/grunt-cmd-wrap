/*
 * grunt-cmd-wrap
 * https://github.com/crossjs/grunt-cmd-wrap
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  grunt.registerMultiTask('cmd-wrap', 'run cmd-wrap with grunt.', function () {

    var done = this.async();

    var child = grunt.util.spawn({
        cmd: 'cmd-wrap',
        args: [
          '--dest', this.data.dest,
          '--port', this.data.port,
          '--pref', this.data.pref
        ]
      }, function (error, result, code) {
        if (error) {
          console.log(error);
        }
        return done(code);
      });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    return child;

  });

};
