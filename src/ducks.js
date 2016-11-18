import _cloneDeep from 'lodash/cloneDeep';
import { combineReducers } from 'redux';

// actions
export const LOCATION_CHANGED = '@@rrc/HISTORY_CHANGED';
export const EXECUTION_STARTED = '@@rrc/EXECUTION_STARTED';
export const EXECUTION_FINISHED = '@@rrc/EXECUTION_FINISHED';

// slice names
export const RRC = 'rrc';
export const LOCATION = 'location';
export const EXECUTION = 'execution';

const locationReducer = (state = {}, action) => {
  return action.type === LOCATION_CHANGED ?
    Object.assign({}, state, action.payload) : state;
}

const executionReducer = (state = {}, action) => {
  switch(action.type) {
    case EXECUTION_FINISHED:
      if (action.payload.key !== state.key)
        break;
    case EXECUTION_STARTED:
      return Object.assign({}, action.payload);
  }
  return state;
}

const handlers = {};
handlers[LOCATION] = locationReducer;
handlers[EXECUTION] = executionReducer;
const reducer = combineReducers(handlers);

// reducer
export default reducer;

export function startExecution(key) {
  return {
    type: EXECUTION_STARTED,
    payload: {
      key,
      start: Date.now(),
      state: {
      }
    }
  }
}

export function doneExecution(key, result) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key,
      end: Date.now(),
      state: {
        done: true,
        result
      }
    }
  }
}

export function error(key, error) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key,
      end: Date.now(),
      state: {
        done: true,
        error
      }
    }
  }
}

export function redirect(key, path) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key,
      end: Date.now(),
      state: {
        done: true,
        redirect: path
      }
    }
  }
}

export function cancel(key) {
  return {
    type: EXECUTION_FINISHED,
    payload: {
      key,
      end: Date.now(),
      state: {
        done: true,
        cancelled: true
      }
    }
  }
}
