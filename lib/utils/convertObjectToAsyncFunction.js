'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = convertObjectToAsyncFunction;

var _entries2 = require('lodash/entries');

var _entries3 = _interopRequireDefault(_entries2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * nest object will be treat as a simple value
 */

function convertObjectToAsyncFunction(obj) {
  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var result, entryKeys, entryValues, entryResults;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              result = {};
              entryKeys = [];
              entryValues = [];

              (0, _entries3.default)(obj).forEach(function (_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    key = _ref3[0],
                    value = _ref3[1];

                entryKeys.push(key);
                if ((0, _isFunction3.default)(value)) {
                  entryValues.push(value.apply(undefined, params));
                } else {
                  entryValues.push(value);
                }
              });
              _context.next = 6;
              return Promise.all(entryValues);

            case 6:
              entryResults = _context.sent;

              entryKeys.forEach(function (key, i) {
                result[key] = entryResults[i];
              });
              return _context.abrupt('return', result);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}
module.exports = exports['default'];