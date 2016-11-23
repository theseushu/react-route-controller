'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createStore;

var _redux = require('redux');

var _ducks = require('../ducks');

var _ducks2 = _interopRequireDefault(_ducks);

var _connectStoreToHistory = require('./connectStoreToHistory');

var _connectStoreToHistory2 = _interopRequireDefault(_connectStoreToHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RRCReducer = {};
RRCReducer[_ducks.RRC] = _ducks2.default;

function createStore(history) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var preloadedState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var enhancer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var store = (0, _redux.createStore)((0, _redux.combineReducers)(_extends({}, RRCReducer, reducers)), preloadedState, enhancer);
  (0, _connectStoreToHistory2.default)(store, history);
  return store;
}
module.exports = exports['default'];