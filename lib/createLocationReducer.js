'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SLICE_NAME = exports.HISTORY_CHANGED = undefined;

exports.default = function (history) {
  var result = {};
  result[SLICE_NAME] = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : history.location;
    var action = arguments[1];

    return action.type === HISTORY_CHANGED ? (0, _cloneDeep3.default)(action.payload) : state;
  };
  return result;
};

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HISTORY_CHANGED = exports.HISTORY_CHANGED = '@@history/HISTORY_CHANGED';

var SLICE_NAME = exports.SLICE_NAME = 'currentLocation';