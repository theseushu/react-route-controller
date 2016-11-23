'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var route1 = exports.route1 = {
  path: '/',
  match: function match(preResult) {
    return 'match';
  },
  error: function error(err) {
    return 'error';
  }
};

var route2 = exports.route2 = {
  path: '/',
  pattern: {
    path: '/item/:id',
    options: { // just test if options pass to pathToRegexp correctly
      sensitive: true
    }
  }
};

var route3 = exports.route3 = {
  path: '/',
  pattern: {
    path: '/user/:userId/item/:id'
  }
};