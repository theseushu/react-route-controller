'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
exports.replaceReducers = replaceReducers;

var _redux = require('redux');

var _createLocationReducer = require('./createLocationReducer');

var _createLocationReducer2 = _interopRequireDefault(_createLocationReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createStore(history) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var preloadedState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var enhancer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var store = (0, _redux.createStore)((0, _redux.combineReducers)(Object.assign({}, reducers, (0, _createLocationReducer2.default)(history))), preloadedState, enhancer);
  return store;
}

function replaceReducers(history, store, reducers) {
  reducers[_createLocationReducer.SLICE_NAME] = (0, _createLocationReducer2.default)(history);
  store.replaceReducer(Object.assign({}, reducers, (0, _createLocationReducer2.default)(history)));
}