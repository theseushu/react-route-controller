'use strict';

var _convertObjectToAsyncFunction = require('../convertObjectToAsyncFunction');

var _convertObjectToAsyncFunction2 = _interopRequireDefault(_convertObjectToAsyncFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('convertObjectToAsyncFunction', function () {
  it('converts an object to async function', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var param1, param2, obj, resultFunc, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            param1 = 'a';
            param2 = { a: 'a', b: 'b' };
            obj = {
              func: jest.fn(function () {
                for (var _len = arguments.length, receivedParams = Array(_len), _key = 0; _key < _len; _key++) {
                  receivedParams[_key] = arguments[_key];
                }

                expect(receivedParams).toEqual([param1, param2]);
                return 'func';
              }),
              asyncFunc: jest.fn(function () {
                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                  for (var _len2 = arguments.length, receivedParams = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    receivedParams[_key2] = arguments[_key2];
                  }

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          expect(receivedParams).toEqual([param1, param2]);
                          return _context.abrupt('return', 'async func');

                        case 2:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }()),
              value: {
                key1: 'value1',
                key2: jest.fn(function () {
                  return 'another func';
                })
              }
            };
            resultFunc = (0, _convertObjectToAsyncFunction2.default)(obj);
            _context2.next = 6;
            return resultFunc(param1, param2);

          case 6:
            result = _context2.sent;


            expect(result.func).toEqual('func');
            expect(result.asyncFunc).toEqual('async func');
            expect(result.value).toEqual(obj.value);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
});