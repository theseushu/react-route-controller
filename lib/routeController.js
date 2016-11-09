'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matches2 = require('lodash/matches');

var _matches3 = _interopRequireDefault(_matches2);

var _locationRegistry = require('./locationRegistry');

var _locationRegistry2 = _interopRequireDefault(_locationRegistry);

var _createLocationReducer = require('./createLocationReducer');

var _connectStoreToHistory = require('./connectStoreToHistory');

var _connectStoreToHistory2 = _interopRequireDefault(_connectStoreToHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteController = function () {
  _createClass(RouteController, null, [{
    key: '_runMatch',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(counter, controller, locationParams, match) {
        var nextParam, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step2;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!Array.isArray(match)) {
                  _context.next = 45;
                  break;
                }

                nextParam = locationParams;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;
                _iterator = match[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 28;
                  break;
                }

                _step2 = _step.value;

                if (!(_step2 == null)) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt('continue', 25);

              case 13:
                if (!controller._validateCounter(counter)) {
                  _context.next = 24;
                  break;
                }

                if (!(typeof _step2 === 'function')) {
                  _context.next = 20;
                  break;
                }

                _context.next = 17;
                return _step2(nextParam);

              case 17:
                _context.t0 = _context.sent;
                _context.next = 21;
                break;

              case 20:
                _context.t0 = _step2;

              case 21:
                nextParam = _context.t0;
                _context.next = 25;
                break;

              case 24:
                if (process.env.NODE_ENV !== 'production') console.log('Routing disrupted due to new requests');

              case 25:
                _iteratorNormalCompletion = true;
                _context.next = 7;
                break;

              case 28:
                _context.next = 34;
                break;

              case 30:
                _context.prev = 30;
                _context.t1 = _context['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 34:
                _context.prev = 34;
                _context.prev = 35;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 37:
                _context.prev = 37;

                if (!_didIteratorError) {
                  _context.next = 40;
                  break;
                }

                throw _iteratorError;

              case 40:
                return _context.finish(37);

              case 41:
                return _context.finish(34);

              case 42:
                return _context.abrupt('return', nextParam);

              case 45:
                if (!(typeof match === 'function')) {
                  _context.next = 50;
                  break;
                }

                _context.next = 48;
                return match(locationParams);

              case 48:
                _context.next = 51;
                break;

              case 50:
                if (process.env.NODE_ENV !== 'production') console.warn('Currently, match supports single or an array of (async)functions only');

              case 51:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 30, 34, 42], [35,, 37, 41]]);
      }));

      function _runMatch(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return _runMatch;
    }()
  }, {
    key: '_runMiss',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(locationParams, miss) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof miss === 'function')) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 3;
                return miss(locationParams);

              case 3:
                _context2.next = 6;
                break;

              case 5:
                if (process.env.NODE_ENV !== 'production') console.error('Theres no "miss" handler');

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _runMiss(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return _runMiss;
    }()
  }, {
    key: '_navigate',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(counter, controller, locationParams, match, miss, error) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                if (!match) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 4;
                return RouteController._runMatch(counter, controller, locationParams, match);

              case 4:
                _context3.next = 8;
                break;

              case 6:
                _context3.next = 8;
                return RouteController._runMiss(locationParams, miss);

              case 8:
                _context3.next = 19;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3['catch'](0);

                if (!(typeof error === 'function')) {
                  _context3.next = 18;
                  break;
                }

                _context3.next = 15;
                return error(_context3.t0);

              case 15:
                return _context3.abrupt('return', _context3.sent);

              case 18:
                if (process.env.NODE_ENV !== 'production') console.error(_context3.t0);

              case 19:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 10]]);
      }));

      function _navigate(_x7, _x8, _x9, _x10, _x11, _x12) {
        return _ref3.apply(this, arguments);
      }

      return _navigate;
    }()
  }]);

  function RouteController(store, config, history) {
    _classCallCheck(this, RouteController);

    _initialiseProps.call(this);

    if (!store || typeof store.subscribe !== 'function' || typeof store.getState !== 'function') throw new Error('You are not passing in a redux store');
    if (config.routes.length === 0) throw new Error('You donot have any routes defined');
    this._store = store;
    if (history) {
      this._history = history;
      (0, _connectStoreToHistory2.default)(this._store, this._history);
    }
    //TODO validate config
    this._locationRegistry = new _locationRegistry2.default(config.routes);
    var match = config.match,
        miss = config.miss,
        error = config.error;

    this._globalHandlers = { match: match, miss: miss, error: error };
  }

  _createClass(RouteController, [{
    key: 'replaceConfig',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(config) {
        var match, miss, error;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this._locationRegistry.replaceRoutes(config.routes);
                match = config.match, miss = config.miss, error = config.error;

                this._globalHandlers = { match: match, miss: miss, error: error };
                _context4.next = 5;
                return this._run(this._location);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function replaceConfig(_x13) {
        return _ref4.apply(this, arguments);
      }

      return replaceConfig;
    }()
  }, {
    key: '_validateCounter',
    value: function _validateCounter(counter) {
      return counter === this._counter;
    }
  }, {
    key: 'start',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this._store.subscribe(function () {
                  var location = _this._store.getState()[_createLocationReducer.SLICE_NAME];
                  _this._location = location;
                  _this._run(_this._location);
                });
                this._location = this._store.getState()[_createLocationReducer.SLICE_NAME];
                _context5.next = 4;
                return this._run(this._location);

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function start() {
        return _ref5.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'history',
    get: function get() {
      return this._history;
    }
  }]);

  return RouteController;
}();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._counter = 0;

  this._run = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(location) {
      var route, matchHandler, errorHandler, missHandler, pathVariables, queryParams, match, error, counter, locationParams;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              route = _this2._locationRegistry.match(location) || {};
              matchHandler = void 0, errorHandler = void 0, missHandler = void 0, pathVariables = void 0, queryParams = void 0;

              if (route == null) {
                matchHandler = _this2._globalHandlers.match;
                errorHandler = _this2._globalHandlers.error;
              } else {
                match = route.match, error = route.error;

                pathVariables = route.pathVariables;
                queryParams = route.queryParams;
                matchHandler = match ? match : _this2._globalHandlers.match;
                errorHandler = error ? error : _this2._globalHandlers.error;
              }
              missHandler = _this2._globalHandlers.miss;
              counter = ++_this2._counter;
              locationParams = { location: location, pathVariables: pathVariables, queryParams: queryParams };
              _context6.next = 8;
              return RouteController._navigate(counter, _this2, locationParams, matchHandler, missHandler, errorHandler);

            case 8:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this2);
    }));

    return function (_x14) {
      return _ref6.apply(this, arguments);
    };
  }();
};

exports.default = RouteController;
module.exports = exports['default'];