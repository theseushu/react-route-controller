import _isPlainObject from 'lodash/isPlainObject';
import _isArray from 'lodash/isArray';
import _isFunction from 'lodash/isFunction';
import _last from 'lodash/last';
import convertObjectToAsyncFunction from './utils/convertObjectToAsyncFunction';

const INITIAL_KEY = 1;
let _key = INITIAL_KEY;
function createKey() {
  return _key++;
}

export default function createExecution(config, listener, extra) {

  let finished = false;
  const key = createKey();
  /**
   * result schedule must be an iterable of async or sync functions
   **/
  function schedule() {
    let { route, match, miss, error } = config;
    let handler, errorHandler;
    if (route) {
      handler = route.match ? route.match : ( match ? match : miss );
      errorHandler = route.error ? route.error : error;
    } else {
      handler = match ? match : miss;
      errorHandler = error;
    }


    if (!_isArray(handler)) {
      handler = [handler];
    }

    let steps = [];

    for (let step of handler) {
      if (_isFunction(step)) {
        steps.push(step);
      } else if (_isPlainObject(step)) {
        steps.push(convertObjectToAsyncFunction(step))
      } else {
        steps.push(() => step)
      }
    }
    return { steps, errorHandler }
  }

  function createContext() {
    return {
      locationParams: config.locationParams,
      done,
      cancel,
      redirect,
      stepResults: [],
      extra,
      first: (key === INITIAL_KEY) // is it the first run
    }
  }

  async function exe() {
    _emit('onStart', execution, config.locationParams);
    const { steps, errorHandler } = schedule(config);


    const context = createContext();
    let params = config.locationParams;
    try {
      for (let step of steps) {
        if (finished)
          break;
        params = await step(params, context);
        context.stepResults.push(params);
      }
      if(finished)
        return;
      done(_last(context.stepResults));
    } catch (err) {
      if (typeof errorHandler=== 'function' && !finished) {
        err = await errorHandler(err);
      }
      _emit('onError', execution, err);
    } finally {

    }
  }

  function _emit(type, ...params) {
    if (listener && _isFunction(listener[type])) {
      listener[type](...params)
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

  const execution = {
    key,
    schedule,
    createContext,
    exe,
    cancel
  }
  return execution;
}
