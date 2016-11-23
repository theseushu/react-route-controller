'use strict';

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _routes = require('./routes');

var _createStore = require('../utils/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _ducks = require('../ducks');

var _createRouteController = require('../createRouteController');

var _createRouteController2 = _interopRequireDefault(_createRouteController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var url = '/user/1/item/2?name=value';

var history = void 0,
    store = void 0,
    location1 = void 0;
beforeEach(function () {
  history = (0, _createMemoryHistory2.default)({ initialEntries: [url] });
  store = (0, _createStore2.default)(history);
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
  it('should throw error if config is not valid', function () {
    expect(function () {
      return (0, _createRouteController2.default)({ routes: [] });
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
            globalError = jest.fn(function (err) {});
            config = {
              routes: [Object.assign({}, route, { match: routeMatch })],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            };

            rc = (0, _createRouteController2.default)(config);
            _context.next = 11;
            return rc.start(store);

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
            globalError = jest.fn(function (err) {});
            config = {
              routes: [Object.assign({}, route, {})],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            };

            rc = (0, _createRouteController2.default)(config);
            rc.start(store);
            expect(routeMatch).toHaveBeenCalledTimes(0);
            expect(routeError).toHaveBeenCalledTimes(0);
            expect(globalMatch).toHaveBeenCalledTimes(1);
            expect(globalMiss).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);

          case 15:
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

            rc = (0, _createRouteController2.default)(config);
            _context3.next = 10;
            return rc.start(store);

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
    var route, rc, error, routeMatch, routeError, globalMatch, globalMiss, globalError, config, stop;
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

            rc = (0, _createRouteController2.default)(config);
            stop = rc.start(store);


            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(routeError).toHaveBeenCalledTimes(1);
            expect(globalMatch).toHaveBeenCalledTimes(0);
            expect(globalMiss).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);

            stop();
            rc.replaceConfig({
              routes: [Object.assign({}, route, { match: routeMatch })],
              match: globalMatch,
              miss: globalMiss,
              error: globalError
            });

            _context4.next = 20;
            return rc.start(store);

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

            rc = (0, _createRouteController2.default)(config, history);
            _context5.next = 8;
            return rc.start(store);

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
  it('should skip some match functions when a new route starts to run', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
    var route, rc, step1, step2, routeMatch, globalMiss, config;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            route = {
              path: '/user/:id/item/:itemId'
            };
            rc = void 0;
            step1 = jest.fn(function () {
              var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(params, context) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        return _context6.abrupt('return', 'step1');

                      case 1:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, undefined);
              }));

              return function (_x, _x2) {
                return _ref7.apply(this, arguments);
              };
            }());
            step2 = jest.fn(function () {
              var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(params, context) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        return _context7.abrupt('return', 'step2');

                      case 1:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, undefined);
              }));

              return function (_x3, _x4) {
                return _ref8.apply(this, arguments);
              };
            }());
            routeMatch = [step1, step2];
            globalMiss = jest.fn();
            config = {
              routes: [Object.assign({}, route, { match: routeMatch }), {
                path: '/'
              }],
              miss: globalMiss
            };

            rc = (0, _createRouteController2.default)(config, history);
            rc.start(store);
            _context8.next = 11;
            return history.push('/');

          case 11:

            expect(step1).toHaveBeenCalledTimes(1);
            expect(step2).toHaveBeenCalledTimes(0);
            expect(globalMiss).toHaveBeenCalledTimes(1);

          case 14:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
  it('should run with multiple stores ', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
    var url1, url2, url3, history1, history2, history3, store1, store2, store3, route1Match, route2Match, miss, config, rc;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            url1 = '/user/2/item/3?name2=value2';
            url2 = '/';
            url3 = '/users?name3=value3';
            history1 = (0, _createMemoryHistory2.default)({ initialEntries: [url] });
            history2 = (0, _createMemoryHistory2.default)({ initialEntries: [url] });
            history3 = (0, _createMemoryHistory2.default)({ initialEntries: [url] });
            store1 = (0, _createStore2.default)(history1);
            store2 = (0, _createStore2.default)(history2);
            store3 = (0, _createStore2.default)(history3);
            route1Match = jest.fn(function (locationParams) {
              return 'result1';
            });
            route2Match = jest.fn(function (locationParams) {
              expect(locationParams.pathVariables).toEqual({});
              expect(locationParams.queryParams).toEqual({ name3: 'value3' });
              return 'result2';
            });
            miss = jest.fn(function (locationParams) {
              return 'missing';
            });
            config = {
              routes: [{
                path: '/user/:id/item/:itemId',
                match: route1Match
              }, {
                path: '/users',
                match: route2Match
              }],
              miss: miss
            };
            rc = (0, _createRouteController2.default)(config);
            _context9.next = 16;
            return rc.start(store1);

          case 16:
            _context9.next = 18;
            return rc.start(store2);

          case 18:
            _context9.next = 20;
            return rc.start(store3);

          case 20:

            expect(route1Match).toHaveBeenCalledTimes(3);
            expect(route2Match).toHaveBeenCalledTimes(0);
            expect(miss).toHaveBeenCalledTimes(0);

            _context9.next = 25;
            return history1.push(url1);

          case 25:
            _context9.next = 27;
            return history2.push(url2);

          case 27:
            _context9.next = 29;
            return history3.push(url3);

          case 29:

            expect(route1Match).toHaveBeenCalledTimes(4);
            expect(route2Match).toHaveBeenCalledTimes(1);
            expect(miss).toHaveBeenCalledTimes(1);
            expect(store1.getState()[_ducks.RRC][_ducks.EXECUTION].state.result).toEqual('result1');
            expect(store2.getState()[_ducks.RRC][_ducks.EXECUTION].state.result).toEqual('missing');
            expect(store3.getState()[_ducks.RRC][_ducks.EXECUTION].state.result).toEqual('result2');

          case 35:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));
});