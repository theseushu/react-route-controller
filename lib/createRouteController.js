'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRouteController;

var _matches2 = require('lodash/matches');

var _matches3 = _interopRequireDefault(_matches2);

var _locationRegistry2 = require('./locationRegistry');

var _locationRegistry3 = _interopRequireDefault(_locationRegistry2);

var _ducks = require('./ducks');

var _createExecution = require('./createExecution');

var _createExecution2 = _interopRequireDefault(_createExecution);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createRouteController(config) {
  var stores = new Set();

  var routes = config.routes,
      globalConfig = _objectWithoutProperties(config, ['routes']);

  if (routes.length === 0) throw new Error('You donot have any routes defined');
  var _routes = routes;
  var _globalConfig = globalConfig;
  var _locationRegistry = new _locationRegistry3.default(_routes);

  function start(store) {
    // stop = route.start(); stop();
    if (stores.has(store)) throw new Error('DO NOT call start with the same store twice! You can stop former run (const stop = store.start(); stop()), then start again ');
    stores.add(store);
    var location = store.getState()[_ducks.RRC][_ducks.LOCATION];
    var unsubscribe = store.subscribe(function () {
      var nextLocation = store.getState()[_ducks.RRC][_ducks.LOCATION];
      if (nextLocation.key !== location.key) {
        location = nextLocation;
        _execute(store, location);
      }
    });
    _execute(store, location);
    return function () {
      unsubscribe();
      stores.delete(store);
    };
  }

  function _execute(store, location) {
    var result = _locationRegistry.match(location); //{locationParams, route}
    var config = {};
    if (result) {
      config = _extends({}, result, _globalConfig);
    } else {
      config = _extends({
        locationParams: {
          location: location
        }
      }, _globalConfig);
    }
    (0, _createExecution2.default)(store, config).exe();
  }

  function replaceConfig(_ref) {
    var routes = _ref.routes,
        globalConfig = _objectWithoutProperties(_ref, ['routes']);

    _routes = routes;
    _globalConfig = globalConfig;
    _locationRegistry = new _locationRegistry3.default(_routes);
  }

  return {
    start: start,
    replaceConfig: replaceConfig
  };
}
module.exports = exports['default'];