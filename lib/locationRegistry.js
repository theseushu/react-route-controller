'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationRegistry = function () {
  // [{path, regex, variables, pre, match, post}]

  function LocationRegistry(routes) {
    _classCallCheck(this, LocationRegistry);

    _initialiseProps.call(this);

    this._processConfig(routes);
  }

  _createClass(LocationRegistry, [{
    key: 'replaceRoutes',
    value: function replaceRoutes(routes) {
      this._processConfig(routes);
    }
  }]);

  return LocationRegistry;
}();

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this._processConfig = function (routes) {
    var _routes = routes.map(function (route) {
      var path = route.path,
          pattern = route.pattern,
          pre = route.pre,
          match = route.match,
          post = route.post,
          error = route.error;

      var result = { pre: pre, match: match, post: post, error: error };

      var variables = [];
      var options = {};
      if (pattern && pattern.path) {
        result.path = pattern.path;
        options = pattern.options;
      } else if (path) {
        result.path = path;
      } else {
        throw new Error('Path must be defined in route or route.pattern!');
      }
      var regex = (0, _pathToRegexp2.default)(result.path, variables, options);

      result.regex = regex;
      result.variables = variables;

      return result;
    });

    _this._routes = _routes;
  };

  this.match = function (location) {
    var routes = _this._routes;
    var pathname = location.pathname,
        search = location.search;


    var matchResult = void 0;
    var route = (0, _find3.default)(routes, function (route) {
      matchResult = route.regex.exec(pathname);
      return matchResult != null;
    });

    if (route == null) {
      return null;
    } else {
      var _ret = function () {
        var variables = route.variables,
            pre = route.pre,
            match = route.match,
            post = route.post,
            error = route.error;
        //parse pathVariables from path-to-regexp match result

        var pathVariables = {};
        variables.forEach(function (variable, i) {
          pathVariables[variable.name] = matchResult[i + 1];
        });
        var queryParams = _queryString2.default.parse(search);

        return {
          v: { pathVariables: pathVariables, queryParams: queryParams, pre: pre, match: match, post: post, error: error }
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };
};

exports.default = LocationRegistry;
module.exports = exports['default'];