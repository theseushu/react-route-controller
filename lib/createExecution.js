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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var INITIAL_KEY = 1;
var _key = INITIAL_KEY;
function createKey() {
  return _key++;
}

function createExecution(config, listener, extra) {
  var exe = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var _schedule, steps, errorHandler, context, params, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step3;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _emit('onStart', execution, config.locationParams);
              _schedule = schedule(config), steps = _schedule.steps, errorHandler = _schedule.errorHandler;
              context = createContext();
              params = config.locationParams;
              _context.prev = 4;
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 8;
              _iterator2 = steps[Symbol.iterator]();

            case 10:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 21;
                break;
              }

              _step3 = _step2.value;

              if (!finished) {
                _context.next = 14;
                break;
              }

              return _context.abrupt('break', 21);

            case 14:
              _context.next = 16;
              return _step3(params, context);

            case 16:
              params = _context.sent;

              context.stepResults.push(params);

            case 18:
              _iteratorNormalCompletion2 = true;
              _context.next = 10;
              break;

            case 21:
              _context.next = 27;
              break;

            case 23:
              _context.prev = 23;
              _context.t0 = _context['catch'](8);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t0;

            case 27:
              _context.prev = 27;
              _context.prev = 28;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 30:
              _context.prev = 30;

              if (!_didIteratorError2) {
                _context.next = 33;
                break;
              }

              throw _iteratorError2;

            case 33:
              return _context.finish(30);

            case 34:
              return _context.finish(27);

            case 35:
              if (!finished) {
                _context.next = 37;
                break;
              }

              return _context.abrupt('return');

            case 37:
              done((0, _last3.default)(context.stepResults));
              _context.next = 47;
              break;

            case 40:
              _context.prev = 40;
              _context.t1 = _context['catch'](4);

              if (!(typeof errorHandler === 'function' && !finished)) {
                _context.next = 46;
                break;
              }

              _context.next = 45;
              return errorHandler(_context.t1);

            case 45:
              _context.t1 = _context.sent;

            case 46:
              _emit('onError', execution, _context.t1);

            case 47:
              _context.prev = 47;
              return _context.finish(47);

            case 49:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 40, 47, 49], [8, 23, 27, 35], [28,, 30, 34]]);
    }));

    return function exe() {
      return _ref.apply(this, arguments);
    };
  }();

  var finished = false;
  var key = createKey();
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
      stepResults: [],
      extra: extra,
      first: key === INITIAL_KEY // is it the first run
    };
  }

  function _emit(type) {
    if (listener && (0, _isFunction3.default)(listener[type])) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      listener[type].apply(listener, params);
    }
  }

  function done(result) {
    finished = true;
    _emit('onDone', execution, result);
  }

  function redirect(path) {
    finished = true;
    _emit('onRedirect', execution, path);
  }

  function cancel() {
    finished = true;
    _emit('onCancel', execution);
  }

  var execution = {
    key: key,
    schedule: schedule,
    createContext: createContext,
    exe: exe,
    cancel: cancel
  };
  return execution;
}
module.exports = exports['default'];