'use strict';

module.exports = function(content) {
  return [
    'define(',
      content,
    ');'
    ].join('');
};
