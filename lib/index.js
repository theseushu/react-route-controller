'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceReducers = exports.createStore = exports.locationRegistry = exports.SLICE_NAME = exports.HISTORY_CHANGED = exports.createLocationReducer = exports.connectStoreToHistory = undefined;

var _helpers = require('./helpers');

var _locationRegistry = require('./locationRegistry');

var _locationRegistry2 = _interopRequireDefault(_locationRegistry);

var _createLocationReducer = require('./createLocationReducer');

var _createLocationReducer2 = _interopRequireDefault(_createLocationReducer);

var _connectStoreToHistory = require('./connectStoreToHistory');

var _connectStoreToHistory2 = _interopRequireDefault(_connectStoreToHistory);

var _routeController = require('./routeController');

var _routeController2 = _interopRequireDefault(_routeController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _routeController2.default;
exports.connectStoreToHistory = _connectStoreToHistory2.default;
exports.createLocationReducer = _createLocationReducer2.default;
exports.HISTORY_CHANGED = _createLocationReducer.HISTORY_CHANGED;
exports.SLICE_NAME = _createLocationReducer.SLICE_NAME;
exports.locationRegistry = _locationRegistry2.default;
exports.createStore = _helpers.createStore;
exports.replaceReducers = _helpers.replaceReducers;