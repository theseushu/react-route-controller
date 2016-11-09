'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectStoreToHistory;

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createLocationReducer = require('./createLocationReducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectStoreToHistory(store, history) {
  if (!store || typeof store.dispatch !== 'function') throw new Error('You are not passing in a redux store');
  history.listen(function (location, action) {
    store.dispatch({ type: _createLocationReducer.HISTORY_CHANGED, payload: location });
  });
}
module.exports = exports['default'];