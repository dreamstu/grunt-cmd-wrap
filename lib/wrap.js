'use strict';

var path = require('path');
var fs = require('fs');
var http = require('http');
var chalk = require('chalk');

chalk.enabled = true;

var transport = require('./transport');

var cached = {};

var colormap = {
  '200': chalk.green,
  '403': chalk.yellow,
  '404': chalk.red
};

function send(req, res, data) {
  console.log(colormap[data.code]('    -- [%s] %s: %s'),
    data.mtime.toISOString().replace('T', ' ').replace(/\..+$/, ''),
    data.code, data.dest);

  res.writeHead(data.code, {
    'Content-Type': data.type
  });

  res.end(data.body);
}

function read(data) {
  var type = 'application/x-javascript';
  var body = fs.readFileSync(data.dest);
  var ext = data.dest.substring(data.dest.lastIndexOf('.'));

  var IMAGE_MIME = {
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
  };

  switch (ext) {
    case '.css':
      type = 'text/css';
      // body = transport.css(body);
      break;
    case '.handlebars':
      body = transport.handlebars(body.toString());
      break;
    case '.js':
      body = transport.js(body.toString());
      break;
    case '.json':
      body = transport.json(body.toString());
      break;
    case '.html':
    case '.htm':
      type = 'text/html';
      break;
    case '.jpg':
    case '.png':
    case '.gif':
      type = IMAGE_MIME[ext];
      break;
    default:
      type = 'text/plain';
      break;
  }

  return {
    type: type,
    body: body
  };
}

function e200(req, res, data) {
  var cache = cached[data.uuid];

  if (!cache) {
    cache = cached[data.uuid] = data;
  }

  if (!cache.mtime || cache.mtime < data.stat.mtime) {
    var processed = read(data);

    cache.type = processed.type;
    cache.body = processed.body;
    cache.mtime = data.stat.mtime || new Date();
  }

  send(req, res, cache);
}

function e403(req, res, data) {
  data.type = 'text/plain';
  data.body = 'Forbidden!';

  send(req, res, data);
}

function e404(req, res, data) {
  data.type = 'text/plain';
  data.body = 'Not found!';

  send(req, res, data);
}

function echo(req, res, data) {
  switch (data.code) {
    case 200:
      e200(req, res, data);
      break;
    case 403:
      e403(req, res, data);
      break;
    case 404:
      e404(req, res, data);
      break;
    default:
      break;
  }
}

function trim(url) {
  return url.replace(/\?.+$/, '');
}

module.exports = function(argv, done) {
  argv || (argv = {});

  if (!argv.dest) {
    argv.dest = '.';
  }

  if (!argv.port) {
    argv.port = 8000;
  }

  if (!argv.rule) {
    argv.rule = /^(((app|mod|spm_modules).+)|index)\.js$/;
  }

  console.log(argv);

  http.createServer(function(req, res) {
    var dest = path.join(argv.dest, trim(req.url));

    if (/\.(css|handlebars)\.js$/.test(dest)) {
      dest = dest.substring(0, dest.length - 3);
    }

    if (fs.existsSync(dest)) {
      var stat = fs.statSync(dest);

      if (stat.isFile()) {
        echo(req, res, {
          code: 200,
          dest: dest,
          uuid: req.url,
          stat: stat
        });
      } else {
        echo(req, res, {
          code: 403,
          dest: dest,
          uuid: req.url,
          mtime: new Date()
        });
      }
    } else {
      echo(req, res, {
        code: 404,
        dest: dest,
        uuid: req.url,
        mtime: new Date()
      });
    }

  }).listen(argv.port, '127.0.0.1');

  console.log(chalk.magenta('■■Listening dest: "%s" at port: "%s" ...'),
    argv.dest, argv.port);

  // done();
};
