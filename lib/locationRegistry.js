'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
          config = _objectWithoutProperties(route, ['path', 'pattern']);

      var variables = [];
      var options = {};
      if (pattern && pattern.path) {
        path = pattern.path;
        options = pattern.options;
      } else if (path == null) {
        throw new Error('Path must be defined in route or route.pattern!');
      }
      var regex = (0, _pathToRegexp2.default)(path, variables, options);

      return _extends({
        regex: regex,
        variables: variables
      }, config);
    });

    _this._routes = _routes;
  };

  this.match = function (location) {
    var routes = _this._routes;
    var pathname = location.pathname,
        search = location.search;


    var matchResult = void 0;
    var matchingRoute = (0, _find3.default)(routes, function (r) {
      matchResult = r.regex.exec(pathname);
      return matchResult != null;
    });

    if (!matchingRoute) {
      return null;
    } else {
      var _ret = function () {
        var regex = matchingRoute.regex,
            variables = matchingRoute.variables,
            routeConfig = _objectWithoutProperties(matchingRoute, ['regex', 'variables']);
        //parse pathVariables from path-to-regexp match result


        var pathVariables = {};
        variables.forEach(function (variable, i) {
          pathVariables[variable.name] = matchResult[i + 1];
        });
        var queryParams = _queryString2.default.parse(search);

        var locationParams = { location: location, pathVariables: pathVariables, queryParams: queryParams };

        return {
          v: { locationParams: locationParams, route: routeConfig }
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };
};

exports.default = LocationRegistry;
module.exports = exports['default'];