'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var route1 = exports.route1 = {
  path: '/',
  pre: function pre(pathVariables, queryParams) {
    return 'pre';
  },
  match: function match(preResult) {
    return 'match';
  },
  post: function post(matchResult) {
    return 'post';
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