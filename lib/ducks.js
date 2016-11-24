'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXECUTION = exports.LOCATION = exports.RRC = exports.EXECUTION_FINISHED = exports.EXECUTION_STARTED = exports.LOCATION_CHANGED = undefined;
exports.startExecution = startExecution;
exports.doneExecution = doneExecution;
exports.error = error;
exports.redirect = redirect;
exports.cancel = cancel;

var _redux = require('redux');

// actions
var LOCATION_CHANGED = exports.LOCATION_CHANGED = '@@rrc/HISTORY_CHANGED';
var EXECUTION_STARTED = exports.EXECUTION_STARTED = '@@rrc/EXECUTION_STARTED';
var EXECUTION_FINISHED = exports.EXECUTION_FINISHED = '@@rrc/EXECUTION_FINISHED';

// slice names
var RRC = exports.RRC = 'rrc';
var LOCATION = exports.LOCATION = 'location';
var EXECUTION = exports.EXECUTION = 'execution';

var locationReducer = function locationReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  return action.type === LOCATION_CHANGED ? Object.assign({}, state, action.payload) : state;
};

var executionReducer = function executionReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case EXECUTION_FINISHED:
      if (action.payload.key !== state.key) break;
    case EXECUTION_STARTED:
      return Object.assign({}, action.payload);
  }
  return state;
};

var handlers = {};
handlers[LOCATION] = locationReducer;
handlers[EXECUTION] = executionReducer;
var reducer = (0, _redux.combineReducers)(handlers);

// reducer
exports.default = reducer;
function startExecution(key) {
  return {
    type: EXECUTION_STARTED,
    payload: {
      key: key,
      start: Date.now(),
      state: {}
    }
  };
}

function doneExecution(key, result) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key: key,
      end: Date.now(),
      state: {
        done: true,
        result: result
      }
    }
  };
}

function error(key, error) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key: key,
      end: Date.now(),
      state: {
        done: true,
        error: error
      }
    }
  };
}

function redirect(key, path) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key: key,
      end: Date.now(),
      state: {
        done: true,
        redirect: path
      }
    }
  };
}

function cancel(key) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key: key,
      end: Date.now(),
      state: {
        done: true,
        cancelled: true
      }
    }
  };
}