'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createExecution;

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _last2 = require('lodash/last');

var _last3 = _interopRequireDefault(_last2);

var _convertObjectToAsyncFunction = require('./utils/convertObjectToAsyncFunction');

var _convertObjectToAsyncFunction2 = _interopRequireDefault(_convertObjectToAsyncFunction);

var _entries = require('lodash/entries');

var _entries2 = _interopRequireDefault(_entries);

var _ducks = require('./ducks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var key = 1;
function createKey() {
  return key++;
}

function createExecution(store, config, enhancer) {
  var exe = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var unsubscribe, _schedule, steps, errorHandler, context, params, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step3;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // console.log(store.getState())
              store.dispatch((0, _ducks.startExecution)(executionKey));
              unsubscribe = store.subscribe(function () {
                var executionState = store.getState()[_ducks.RRC][_ducks.EXECUTION];
                if (executionState.key !== executionKey) {
                  unsubscribe();
                  cancel();
                } else if (executionState.done) {
                  unsubscribe();
                }
              });
              _schedule = schedule(config), steps = _schedule.steps, errorHandler = _schedule.errorHandler;
              context = createContext();
              params = config.locationParams;
              _context.prev = 5;
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 9;
              _iterator2 = steps[Symbol.iterator]();

            case 11:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 22;
                break;
              }

              _step3 = _step2.value;

              if (!finished) {
                _context.next = 15;
                break;
              }

              return _context.abrupt('break', 22);

            case 15:
              _context.next = 17;
              return _step3(params, context);

            case 17:
              params = _context.sent;

              context.stepResults.push(params);

            case 19:
              _iteratorNormalCompletion2 = true;
              _context.next = 11;
              break;

            case 22:
              _context.next = 28;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context['catch'](9);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t0;

            case 28:
              _context.prev = 28;
              _context.prev = 29;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 31:
              _context.prev = 31;

              if (!_didIteratorError2) {
                _context.next = 34;
                break;
              }

              throw _iteratorError2;

            case 34:
              return _context.finish(31);

            case 35:
              return _context.finish(28);

            case 36:
              if (!finished) {
                _context.next = 38;
                break;
              }

              return _context.abrupt('return');

            case 38:
              store.dispatch((0, _ducks.doneExecution)(executionKey, (0, _last3.default)(context.stepResults)));
              _context.next = 48;
              break;

            case 41:
              _context.prev = 41;
              _context.t1 = _context['catch'](5);

              if (!(typeof errorHandler === 'function' && !finished)) {
                _context.next = 47;
                break;
              }

              _context.next = 46;
              return errorHandler(_context.t1);

            case 46:
              _context.t1 = _context.sent;

            case 47:
              store.dispatch((0, _ducks.error)(executionKey, _context.t1));

            case 48:
              _context.prev = 48;

              unsubscribe();
              return _context.finish(48);

            case 51:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 41, 48, 51], [9, 24, 28, 36], [29,, 31, 35]]);
    }));

    return function exe() {
      return _ref.apply(this, arguments);
    };
  }();

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createExecution)(store, config);
  }

  var finished = false;
  var executionKey = createKey();
  /**
   * result schedule must be an iterable of async or sync functions
   **/
  function schedule() {
    var route = config.route,
        match = config.match,
        miss = config.miss,
        error = config.error;

    var handler = void 0,
        errorHandler = void 0;
    if (route) {
      handler = route.match ? route.match : match ? match : miss;
      errorHandler = route.error ? route.error : error;
    } else {
      handler = match ? match : miss;
      errorHandler = error;
    }

    if (!(0, _isArray3.default)(handler)) {
      handler = [handler];
    }

    var steps = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var step = _step.value;

        if ((0, _isFunction3.default)(step)) {
          steps.push(step);
        } else if ((0, _isPlainObject3.default)(step)) {
          steps.push((0, _convertObjectToAsyncFunction2.default)(step));
        } else {
          steps.push(function () {
            return step;
          });
        }
      };

      for (var _iterator = handler[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return { steps: steps, errorHandler: errorHandler };
  }

  function createContext() {
    return {
      locationParams: config.locationParams,
      done: done,
      cancel: cancel,
      redirect: redirect,
      stepResults: []
    };
  }

  function done(result) {
    finished = true;
    store.dispatch((0, _ducks.doneExecution)(executionKey, result));
  }

  function redirect(path) {
    finished = true;
    store.dispatch((0, _ducks.redirect)(executionKey, path));
  }

  function cancel() {
    finished = true;
    store.dispatch((0, _ducks.cancel)(executionKey));
  }

  return {
    schedule: schedule,
    createContext: createContext,
    exe: exe
  };
}
module.exports = exports['default'];