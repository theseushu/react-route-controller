'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectStoreToHistory;

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _ducks = require('../ducks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//dispatch a LOCATION_CHANGED at once, then subscribe store to history, dispatch LOCATION_CHANGED actions whenever location changes
function connectStoreToHistory(store, history) {
  if (!store || typeof store.dispatch !== 'function') throw new Error('You are not passing in a redux store');

  store.dispatch({ type: _ducks.LOCATION_CHANGED, payload: history.location });

  history.listen(function (location, action) {
    store.dispatch({ type: _ducks.LOCATION_CHANGED, payload: location });
  });
}
module.exports = exports['default'];