'use strict';

var chalk = require('chalk');
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

module.exports = function server(options) {

  chalk.enabled = true;

  options || (options = {});

  options.base || (options.base = '.');
  options.port || (options.port = 8080);
  options.wrap || (options.wrap = function(url) {
          return /^(((app|mod|spm_modules).+)|index)\.js$/.test(url);
        });

  var index = serveIndex(options.base, {'icons': true});

  function fullPath(url) {
    return path.join(process.cwd(), options.base, url);
  }

  function realPath(url) {
    return url.replace(/\.(css|handlebars|tpl)\.js$/, '.$1');
  }

  function mimeType(url) {
    return mime.lookup(url.replace(/\?+.+$/, ''));
  }

  function wrapBuff(buf, ext) {
    if (buf instanceof Buffer) {
      buf = buf.toString();
    }

    switch (ext) {
      case '.handlebars':
        return transport.handlebars(buf);
      case '.css':
        return transport.css(buf);
      case '.js':
        return transport.js(buf);
      case '.json':
        return transport.json(buf);
      default:
        break;
    }
  }

  function serve(req, res, done) {
    var url = realPath(fullPath(req.url));

    fs.readFile(url, function (err, buf) {
      if (err) {
        return done(err);
      }

      console.log(chalk.green('    %s'), req.url);

      if (options.wrap(req.url)) {
        buf = wrapBuff(buf, url.substring(url.lastIndexOf('.')));
      }

      res.setHeader('Content-Type', mimeType(req.url) + '; charset=utf-8');
      res.end(buf);
    });
  }

  // Create server
  var server = http.createServer(function onRequest(req, res){
    var done = finalhandler(req, res, {
      onerror: logError
    });

    req.url = req.url.replace(/\?+.+$/, '');

    index(req, res, function() {
      serve(req, res, done);
    });
  });

  // Listen
  server.listen(options.port);

  console.log(chalk.magenta('■■Listening dest: "%s" at port: "%s" ...'), options.base, options.port);

};
