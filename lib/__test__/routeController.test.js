'use strict';

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _routes = require('./routes');

var _helpers = require('../helpers');

var _routeController = require('../routeController');

var _routeController2 = _interopRequireDefault(_routeController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var url1 = '/user/1/item/2?name=value';

var history = void 0,
    store = void 0,
    location1 = void 0;
beforeEach(function () {
  history = (0, _createMemoryHistory2.default)({ initialEntries: [url1] });
  store = (0, _helpers.createStore)(history);
  location1 = history.location;
});

var createHandler = function createHandler(expectation) {
  return function (locationParams) {
    expectation(locationParams).toEqual({
      location: url
    });
    new Promise(function (resolve) {
      return setTimeout(function () {
        resolve('Pre result of route');
      }, 200);
    });
  };
};

describe('Route controller', function () {
  it('should throw error if store/config is not valid', function () {
    expect(function () {
      return new _routeController2.default({}, config);
    }).toThrow();
    expect(function () {
      return new _routeController2.default(store, { routes: [] });
    }).toThrow();
  });
  it('should process routes handler', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var route, rc, routeMatch, routeError, globalMatch, globalMiss, globalError, config;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            route = {
              path: '/user/:id/item/:itemId'
            };
            rc = void 0;
            routeMatch = jest.fn(function (locationParams) {
              expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' });
              expect(locationParams.queryParams).toEqual({ name: 'value' });
              return 'Match result of route';
            });
            routeError = jest.fn();
            globalMatch = jest.fn();
            globalMiss = jest.fn();
            globalError = jest.fn(function (err) {
              return console.log(err);
            });
            config = {
              routes: [Object.assign({}, route, { match: routeMatch })],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            };

            rc = new _routeController2.default(store, config);
            _context.next = 11;
            return rc.start();

          case 11:
            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(routeError).toHaveBeenCalledTimes(0);
            expect(globalMatch).toHaveBeenCalledTimes(0);
            expect(globalMiss).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
  it('should process global handler', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var route, rc, routeMatch, routeError, globalMatch, globalMiss, globalError, config;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            route = {
              path: '/user/:id/item/:itemId'
            };
            rc = void 0;
            routeMatch = jest.fn();
            routeError = jest.fn();
            globalMatch = jest.fn(function (locationParams) {
              expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' });
              expect(locationParams.queryParams).toEqual({ name: 'value' });
              return 'Match result of route';
            });
            globalMiss = jest.fn();
            globalError = jest.fn(function (err) {
              return console.log(err);
            });
            config = {
              routes: [Object.assign({}, route, {})],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            };

            rc = new _routeController2.default(store, config);
            _context2.next = 11;
            return rc._run(history.location);

          case 11:
            expect(routeMatch).toHaveBeenCalledTimes(0);
            expect(routeError).toHaveBeenCalledTimes(0);
            expect(globalMatch).toHaveBeenCalledTimes(1);
            expect(globalMiss).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
  it('should process miss handler', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var rc, routeMatch, routeError, globalMatch, globalMiss, globalError, config;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            rc = void 0;
            routeMatch = jest.fn();
            routeError = jest.fn();
            globalMatch = jest.fn();
            globalMiss = jest.fn(function (locationParams) {
              return 'Match result of route';
            });
            globalError = jest.fn();
            config = {
              routes: [{
                path: '/'
              }],
              miss: globalMiss,
              error: globalError
            };

            rc = new _routeController2.default(store, config);
            _context3.next = 10;
            return rc._run(history.location);

          case 10:
            expect(routeMatch).toHaveBeenCalledTimes(0);
            expect(routeError).toHaveBeenCalledTimes(0);
            expect(globalMatch).toHaveBeenCalledTimes(0);
            expect(globalMiss).toHaveBeenCalledTimes(1);
            expect(globalError).toHaveBeenCalledTimes(0);

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
  it('should process right error handler', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    var route, rc, error, routeMatch, routeError, globalMatch, globalMiss, globalError, config;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            route = {
              path: '/user/:id/item/:itemId'
            };
            rc = void 0;
            error = new Error('error');
            routeMatch = jest.fn(function (locationParams) {
              expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' });
              expect(locationParams.queryParams).toEqual({ name: 'value' });
              throw error;
            });
            routeError = jest.fn(function (err) {
              expect(err).toEqual(error);
            });
            globalMatch = jest.fn();
            globalMiss = jest.fn();
            globalError = jest.fn(function (err) {
              expect(err).toEqual(error);
            });
            config = {
              routes: [Object.assign({}, route, { match: routeMatch, error: routeError })],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            };

            rc = new _routeController2.default(store, config);
            _context4.next = 12;
            return rc.start();

          case 12:

            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(routeError).toHaveBeenCalledTimes(1);
            expect(globalMatch).toHaveBeenCalledTimes(0);
            expect(globalMiss).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);

            rc.replaceConfig({
              routes: [Object.assign({}, route, { match: routeMatch })],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            });

            _context4.next = 20;
            return rc._run(history.location);

          case 20:
            expect(globalError).toHaveBeenCalledTimes(1);

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
  it('should response to history', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
    var rc, error, routeMatch, routeMatch2, config;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            rc = void 0;
            error = new Error('error');
            routeMatch = jest.fn(function (locationParams) {
              expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' });
              expect(locationParams.queryParams).toEqual({ name: 'value' });
            });
            routeMatch2 = jest.fn(function (locationParams) {
              expect(locationParams.pathVariables).toEqual({});
              expect(locationParams.queryParams).toEqual({});
            });
            config = {
              routes: [{
                path: '/user/:id/item/:itemId',
                match: routeMatch
              }, {
                path: '/',
                match: routeMatch2
              }]
            };

            rc = new _routeController2.default(store, config, history);
            _context5.next = 8;
            return rc.start();

          case 8:

            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(routeMatch2).toHaveBeenCalledTimes(0);

            history.push('/'); // in this case, all function calls are sync ( every matchHandler is a sync function )

            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(routeMatch2).toHaveBeenCalledTimes(1);

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));
  it('should skip some match functions when a new route starts to run', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
    var route, rc, step1, step2, step3, routeMatch, globalMiss, config;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            route = {
              path: '/user/:id/item/:itemId'
            };
            rc = void 0;
            step1 = jest.fn(function (locationParams) {
              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve('first result');
                }, 100);
              });
            });
            step2 = jest.fn(function (firstResult) {
              expect(firstResult).toEqual('first result');
              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve('second result');
                }, 100);
              });
            });
            step3 = jest.fn(function (secondResult) {
              expect(secondResult).toEqual('second result');
              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve('3rd result');
                }, 100);
              });
            });
            routeMatch = [step1, step2, step3];
            globalMiss = jest.fn();
            config = {
              routes: [Object.assign({}, route, { match: routeMatch }), {
                path: '/'
              }],
              miss: globalMiss
            };

            rc = new _routeController2.default(store, config);
            rc.start();

            _context6.next = 12;
            return rc._run(history.location);

          case 12:
            _context6.next = 14;
            return rc._run({ pathname: '/' });

          case 14:

            expect(step1).toHaveBeenCalledTimes(2);
            expect(step2).toHaveBeenCalledTimes(1);
            expect(step3).toHaveBeenCalledTimes(1);
            expect(globalMiss).toHaveBeenCalledTimes(1);

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});