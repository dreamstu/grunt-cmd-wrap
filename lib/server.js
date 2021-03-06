'use strict';

var chalk = require('chalk');
var favicon = require('serve-favicon');
var finalhandler = require('finalhandler');
var fs = require('fs');
var http = require('http');
var mime = require('mime');
var path = require('path');
var serveIndex = require('serve-index');
var transport = require('./transport');

function logError(err) {
  console.error(err.stack || err.toString());
}

var prefix, index, alias;

module.exports = function server(options) {

  chalk.enabled = true;

  options || (options = {});

  if (!options.base) {
    options.base = '.';
  }

  if (!options.port) {
    options.port = 8080;
  }

  if (!options.wrap) {
    prefix = path.relative(options.base, process.cwd());
    options.wrap = function(url) {
      if (prefix) {
        if (prefix.indexOf('..') !== -1) {
          url = url.replace(/^\/[^\/]+/, '');
        } else if (url.indexOf('/' + prefix) !== -1) {
          url = url.substring(prefix.length + 1);
        }
      }
      // 默认匹配
      return /^\/(((app|mod|spm_modules).+)|index)\.js$/.test(url);
    };
  }

  index = serveIndex(options.base, {
    'icons': true
  });

  function parseAlias() {
    var mroot = 'spm_modules';
    var mprefix = path.relative(options.base, mroot).replace(/\\/g, '/');

    alias = {};

    if (fs.existsSync(mroot)) {
      fs.readdirSync(mroot).forEach(function(dest) {
        var version = fs.readdirSync(path.join(mroot, dest))[0];
        var spmmain = fs.readFileSync(path.join(mroot, dest, version, 'package.json'));

        // 移除多余的 `./`
        spmmain = JSON.parse(spmmain).spm.main.replace(/^\.\//, '');

        alias[dest] = mprefix + '/' + dest + '/' + version + '/' + spmmain;
      });
    }
  }

  function getFullPath(url) {
    return path.join(process.cwd(), options.base, url);
  }

  function getRealPath(url) {
    return url.replace(/\.(css|handlebars|tpl)\.js$/, '.$1');
  }

  function getMimeType(url) {
    return mime.lookup(url.replace(/\?+.+$/, ''));
  }

  function transBuffer(buf, ext) {
    function replaceDependencies(buf) {
      if (!alias) {
        parseAlias();
      }

      /*jshint maxparams:4 */
      buf = buf.replace(/(require\(['"])([\w\-\.]+)(['"]\))/g, function($0, $1, $2, $3) {
        if (alias.hasOwnProperty($2)) {
          $2 = alias[$2];
        }
        return $1 + $2 + $3;
      });

      return buf;
    }

    if (buf instanceof Buffer) {
      buf = buf.toString();
    }

    switch (ext) {
      case '.handlebars':
        buf = transport.handlebars(buf);
        break;
      case '.css':
        buf = transport.css(buf);
        break;
      case '.js':
        buf = transport.js(buf);
        break;
      case '.json':
        buf = transport.json(buf);
        break;
      default:
        break;
    }

    return replaceDependencies(buf);
  }

  function serve(req, res, done) {
    var url = getRealPath(getFullPath(req.url));

    fs.readFile(url, function (err, buf) {
      if (err) {
        return done(err);
      }

      console.log(chalk.green('    %s'), req.url);

      // check if need wrapping
      if (options.wrap(req.url)) {
        buf = transBuffer(buf, url.substring(url.lastIndexOf('.')));
      }

      res.setHeader('Content-Type', getMimeType(req.url) + '; charset=utf-8');
      res.end(buf);
    });
  }

  // Create server
  var server = http.createServer(function onRequest(req, res){
    var done = finalhandler(req, res, {
      onerror: logError
    });

    // serve favicon
    favicon(__dirname + '/assets/favicon.png')(req, res, function(err) {
      if (err) {
        return done(err);
      }

      req.url = req.url.replace(/\?+.+$/, '');

      // serve directory
      index(req, res, function() {
        // serve files
        serve(req, res, done);
      });
    });
  });

  // Listen
  server.listen(options.port);

  console.log(chalk.magenta('■■Listening dest: "%s" at port: "%s" ...'), options.base, options.port);

};
