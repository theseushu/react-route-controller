'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createRouteController;

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _locationRegistry2 = require('./locationRegistry');

var _locationRegistry3 = _interopRequireDefault(_locationRegistry2);

var _createExecution = require('./createExecution');

var _createExecution2 = _interopRequireDefault(_createExecution);

var _ducks = require('./ducks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var listenerKey = 10;

function createExecutionListener(store, listener) {
  var key = listenerKey++;
  var unsubscribe = void 0;
  function unsubscribeStore() {
    if ((0, _isFunction3.default)(unsubscribe)) {
      unsubscribe();
    }
  }
  function process(params) {
    if ((0, _isFunction3.default)(listener)) listener(params);
  }
  var currentState = void 0;
  return {
    onStart: function onStart(execution, locationParams) {
      store.dispatch((0, _ducks.startExecution)(execution.key));
      unsubscribe = store.subscribe(function () {
        var executionState = store.getState()[_ducks.RRC][_ducks.EXECUTION];
        if (!(0, _isEqual3.default)(currentState, executionState)) {
          currentState = executionState;
          if (executionState.key !== execution.key) {
            execution.cancel();
          }
        }
      });
      process({ done: false, locationParams: locationParams });
    },
    onDone: function onDone(execution, result) {
      unsubscribeStore();
      store.dispatch((0, _ducks.doneExecution)(execution.key, result));
      process({ done: true, result: result });
    },
    onError: function onError(execution, err) {
      unsubscribeStore();
      store.dispatch((0, _ducks.error)(execution.key, err));
      process({ done: true, error: err });
    },
    onCancel: function onCancel(execution) {
      unsubscribeStore();
      store.dispatch((0, _ducks.cancel)(execution.key));
      process({ done: true, cancelled: true });
    },
    onRedirect: function onRedirect(execution, redirect) {
      unsubscribeStore();
      store.dispatch((0, _ducks.redirect)(execution.key, redirect));
      process({ done: true, redirect: redirect });
    }
  };
}

function createRouteController(config) {
  var stores = new Set();

  var routes = config.routes,
      globalConfig = _objectWithoutProperties(config, ['routes']);

  if (routes.length === 0) throw new Error('You donot have any routes defined');
  var _routes = routes;
  var _globalConfig = globalConfig;
  var _locationRegistry = new _locationRegistry3.default(_routes);

  function start(store, listener) {
    // stop = route.start(); stop();
    if (stores.has(store)) throw new Error('DO NOT call start with the same store twice! You can stop former run (const stop = store.start(); stop()), then start again ');
    stores.add(store);
    var location = store.getState()[_ducks.RRC][_ducks.LOCATION];
    var unsubscribe = store.subscribe(function () {
      var nextLocation = store.getState()[_ducks.RRC][_ducks.LOCATION];
      if (nextLocation.key !== location.key) {
        location = nextLocation;
        _execute(store, location, listener);
      }
    });
    _execute(store, location, listener);
    return function () {
      unsubscribe();
      stores.delete(store);
    };
  }

  function _execute(store, location, listener) {
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
    var executionListener = createExecutionListener(store, listener);
    (0, _createExecution2.default)(config, executionListener, { store: store }).exe();
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