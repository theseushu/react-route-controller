'use strict';

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _createStore = require('../utils/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _createExecution = require('../createExecution');

var _createExecution2 = _interopRequireDefault(_createExecution);

var _ducks = require('../ducks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var history = void 0,
    store = void 0,
    listener = void 0;

beforeEach(function () {

  history = (0, _createMemoryHistory2.default)({});
  store = (0, _createStore2.default)(history);
  listener = {
    onStart: function onStart(execution) {
      store.dispatch((0, _ducks.startExecution)(execution.key));
    },
    onDone: function onDone(execution, result) {
      store.dispatch((0, _ducks.doneExecution)(execution.key, result));
    },
    onError: function onError(execution, err) {
      store.dispatch((0, _ducks.error)(execution.key, err));
    },
    onCancel: function onCancel(execution) {
      store.dispatch((0, _ducks.cancel)(execution.key));
    },
    onRedirect: function onRedirect(execution, redirect) {
      store.dispatch((0, _ducks.redirect)(execution.key, redirect));
    }
  };
});

describe('createExecution', function () {
  it('creates an execution sequence and execute it', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    var locationParams, step1, step2First, step2Second, step3, config;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            locationParams = {
              location: history.location
            };
            step1 = jest.fn(function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(params, context) {
                var _context$locationPara, location, pathVariables, queryParams;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        expect(params).toEqual(context.locationParams);
                        _context$locationPara = context.locationParams, location = _context$locationPara.location, pathVariables = _context$locationPara.pathVariables, queryParams = _context$locationPara.queryParams;

                        expect(location).toEqual(history.location);
                        return _context.abrupt('return', 'step1');

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x, _x2) {
                return _ref2.apply(this, arguments);
              };
            }());
            step2First = jest.fn(function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(params, context) {
                var _context$locationPara2, location, pathVariables, queryParams;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        expect(params).toEqual('step1');
                        _context$locationPara2 = context.locationParams, location = _context$locationPara2.location, pathVariables = _context$locationPara2.pathVariables, queryParams = _context$locationPara2.queryParams;

                        expect(location).toEqual(history.location);
                        return _context2.abrupt('return', 'step2 first');

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x3, _x4) {
                return _ref3.apply(this, arguments);
              };
            }());
            step2Second = jest.fn(function (params, context) {
              expect(params).toEqual('step1');
              var _context$locationPara3 = context.locationParams,
                  location = _context$locationPara3.location,
                  pathVariables = _context$locationPara3.pathVariables,
                  queryParams = _context$locationPara3.queryParams;

              expect(location).toEqual(history.location);
            });
            step3 = jest.fn(function () {
              var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(params, context) {
                var _context$locationPara4, location, pathVariables, queryParams;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        expect(params).toEqual({ first: 'step2 first', second: undefined, third: 'step2 third' });
                        _context$locationPara4 = context.locationParams, location = _context$locationPara4.location, pathVariables = _context$locationPara4.pathVariables, queryParams = _context$locationPara4.queryParams;

                        expect(location).toEqual(history.location);
                        return _context3.abrupt('return', 'step3');

                      case 4:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x5, _x6) {
                return _ref4.apply(this, arguments);
              };
            }());
            config = {
              locationParams: locationParams,
              route: {
                match: [step1, {
                  first: step2First,
                  second: step2Second,
                  third: 'step2 third'
                }, step3, 'step4']
              }
            };
            _context4.next = 8;
            return (0, _createExecution2.default)(config, listener).exe();

          case 8:
            expect(step1).toHaveBeenCalledTimes(1);
            expect(step2First).toHaveBeenCalledTimes(1);
            expect(step2Second).toHaveBeenCalledTimes(1);
            expect(step3).toHaveBeenCalledTimes(1);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.result).toEqual('step4');
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.done).toEqual(true);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.cancel).toBeUndefined();
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.redirect).toBeUndefined();

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('run execution control methods', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
    var locationParams, step1done, step2, config, step1cancel, step1redirect;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            locationParams = {
              location: history.location
            };
            step1done = jest.fn(function () {
              var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(params, context) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        context.done('stop execution now');
                        return _context5.abrupt('return', 'step1');

                      case 2:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, undefined);
              }));

              return function (_x7, _x8) {
                return _ref6.apply(this, arguments);
              };
            }());
            step2 = jest.fn(function () {
              var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(params, context) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        return _context6.abrupt('return', 'step2 first');

                      case 1:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, undefined);
              }));

              return function (_x9, _x10) {
                return _ref7.apply(this, arguments);
              };
            }());
            config = {
              locationParams: locationParams,
              route: {
                match: [step1done, step2]
              }
            };
            _context9.next = 6;
            return (0, _createExecution2.default)(config, listener).exe();

          case 6:
            expect(step1done).toHaveBeenCalledTimes(1);
            expect(step2).toHaveBeenCalledTimes(0);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.result).toEqual('stop execution now');

            step1cancel = jest.fn(function () {
              var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(params, context) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        context.cancel();
                        return _context7.abrupt('return', 'step1');

                      case 2:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, undefined);
              }));

              return function (_x11, _x12) {
                return _ref8.apply(this, arguments);
              };
            }());

            config = {
              locationParams: locationParams,
              route: {
                match: [step1cancel, step2]
              }
            };
            _context9.next = 13;
            return (0, _createExecution2.default)(config, listener).exe();

          case 13:
            expect(step1cancel).toHaveBeenCalledTimes(1);
            expect(step2).toHaveBeenCalledTimes(0);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.cancelled).toEqual(true);

            step1redirect = jest.fn(function () {
              var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(params, context) {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        context.redirect('///');
                        return _context8.abrupt('return', 'step1');

                      case 2:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, undefined);
              }));

              return function (_x13, _x14) {
                return _ref9.apply(this, arguments);
              };
            }());

            config = {
              locationParams: locationParams,
              route: {
                match: [step1redirect, step2]
              }
            };
            _context9.next = 20;
            return (0, _createExecution2.default)(config, listener).exe();

          case 20:
            expect(step1redirect).toHaveBeenCalledTimes(1);
            expect(step2).toHaveBeenCalledTimes(0);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.redirect).toEqual('///');

          case 23:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('cancel current execution if theres a new one', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
    var config, locationParams, step1, step2, executionKey;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            config = void 0;
            locationParams = {
              location: history.location
            };
            step1 = jest.fn(function () {
              var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(params, context) {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        return _context10.abrupt('return', 'step1');

                      case 1:
                      case 'end':
                        return _context10.stop();
                    }
                  }
                }, _callee10, undefined);
              }));

              return function (_x15, _x16) {
                return _ref11.apply(this, arguments);
              };
            }());
            step2 = jest.fn(function () {
              var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(params, context) {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        return _context11.abrupt('return', 'step2');

                      case 1:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, _callee11, undefined);
              }));

              return function (_x17, _x18) {
                return _ref12.apply(this, arguments);
              };
            }());

            config = {
              locationParams: locationParams,
              route: {
                match: [step1, step2]
              }
            };
            listener.onStart = function (execution) {
              var unsubscribe = store.subscribe(function () {
                var executionState = store.getState()[_ducks.RRC][_ducks.EXECUTION];
                if (executionState.key !== execution.key) {
                  unsubscribe();
                  execution.cancel();
                } else if (executionState.done) {
                  unsubscribe();
                }
              });
              store.dispatch((0, _ducks.startExecution)(execution.key));
            };
            (0, _createExecution2.default)(config, listener).exe();

            executionKey = store.getState()[_ducks.RRC][_ducks.EXECUTION].key;
            _context12.next = 10;
            return (0, _createExecution2.default)(config, listener).exe();

          case 10:
            expect(step1).toHaveBeenCalledTimes(2);
            expect(step2).toHaveBeenCalledTimes(1);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].key).toEqual(executionKey + 1);

          case 13:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));
  it('chooses right match handler', _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
    var locationParams, routeMatch, globalMatch, routeError, globalError, miss, config;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            locationParams = {
              location: history.location
            };
            routeMatch = jest.fn();
            globalMatch = jest.fn();
            routeError = jest.fn();
            globalError = jest.fn();
            miss = jest.fn();
            config = {
              locationParams: locationParams,
              route: {
                match: routeMatch,
                error: routeError
              },
              error: globalError,
              miss: miss,
              match: globalMatch
            };
            _context13.next = 9;
            return (0, _createExecution2.default)(config, listener).exe();

          case 9:
            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(globalMatch).toHaveBeenCalledTimes(0);
            expect(routeError).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);
            expect(miss).toHaveBeenCalledTimes(0);
            config = {
              locationParams: locationParams,
              route: {
                error: routeError
              },
              error: globalError,
              miss: miss,
              match: globalMatch
            };
            _context13.next = 17;
            return (0, _createExecution2.default)(config, listener).exe();

          case 17:
            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(globalMatch).toHaveBeenCalledTimes(1);
            expect(routeError).toHaveBeenCalledTimes(0);
            expect(globalError).toHaveBeenCalledTimes(0);
            expect(miss).toHaveBeenCalledTimes(0);

          case 22:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('chooses right error handler', _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
    var locationParams, error, routeMatch, routeError, globalError, config;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            locationParams = {
              location: history.location
            };
            error = new Error();
            routeMatch = jest.fn(function () {
              throw error;
            });
            routeError = jest.fn(function (err) {
              expect(err).toEqual(error);
              return 'route error';
            });
            globalError = jest.fn(function (err) {
              expect(err).toEqual(error);
              return 'global error';
            });
            config = {
              locationParams: locationParams,
              route: {
                match: routeMatch,
                error: routeError
              },
              error: globalError
            };
            _context14.next = 8;
            return (0, _createExecution2.default)(config, listener).exe();

          case 8:
            expect(routeMatch).toHaveBeenCalledTimes(1);
            expect(routeError).toHaveBeenCalledTimes(1);
            expect(globalError).toHaveBeenCalledTimes(0);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.done).toEqual(true);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.error).toEqual('route error');
            config = {
              locationParams: locationParams,
              route: {
                match: routeMatch
              },
              error: globalError
            };
            _context14.next = 16;
            return (0, _createExecution2.default)(config, listener).exe();

          case 16:
            expect(routeMatch).toHaveBeenCalledTimes(2);
            expect(routeError).toHaveBeenCalledTimes(1);
            expect(globalError).toHaveBeenCalledTimes(1);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.done).toEqual(true);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.error).toEqual('global error');

          case 21:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));

  it('run miss handler where theres no matching route', _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
    var locationParams, error, globalError, miss, config;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            locationParams = {
              location: history.location
            };
            error = new Error();
            globalError = jest.fn(function (err) {
              expect(err).toEqual(error);
              return 'error';
            });
            miss = jest.fn(function () {
              var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(params, context) {
                var _context$locationPara5, location, pathVariables, queryParams;

                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        expect(params).toEqual(context.locationParams);
                        _context$locationPara5 = context.locationParams, location = _context$locationPara5.location, pathVariables = _context$locationPara5.pathVariables, queryParams = _context$locationPara5.queryParams;

                        expect(location).toEqual(history.location);
                        throw error;

                      case 4:
                      case 'end':
                        return _context15.stop();
                    }
                  }
                }, _callee15, undefined);
              }));

              return function (_x19, _x20) {
                return _ref16.apply(this, arguments);
              };
            }());
            config = {
              locationParams: locationParams,
              miss: miss,
              error: globalError
            };
            _context16.next = 7;
            return (0, _createExecution2.default)(config, listener).exe();

          case 7:
            expect(miss).toHaveBeenCalledTimes(1);
            expect(globalError).toHaveBeenCalledTimes(1);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.done).toEqual(true);
            expect(store.getState()[_ducks.RRC][_ducks.EXECUTION].state.error).toEqual('error');

          case 11:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  })));
});