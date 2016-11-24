'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createRouteController = require('./createRouteController');

Object.defineProperty(exports, 'createRouteController', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createRouteController).default;
  }
});

var _replaceReducers = require('./utils/replaceReducers');

Object.defineProperty(exports, 'replaceReducers', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_replaceReducers).default;
  }
});

var _createStore = require('./utils/createStore');

Object.defineProperty(exports, 'createStore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createStore).default;
  }
});

var _ducks = require('./ducks');

Object.defineProperty(exports, 'reducer', {
  enumerable: true,
  get: function get() {
    return _ducks.reducer;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }