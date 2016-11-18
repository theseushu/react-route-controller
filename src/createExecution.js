import _isPlainObject from 'lodash/isPlainObject';
import _isArray from 'lodash/isArray';
import _isFunction from 'lodash/isFunction';
import _last from 'lodash/last';
import convertObjectToAsyncFunction from './utils/convertObjectToAsyncFunction'
import entries from 'lodash/entries';
import { RRC, LOCATION, EXECUTION, startExecution, doneExecution,
  error as createErrorAction, redirect as redirectAction, cancel as createCancelAction } from './ducks'

let key = 1;
function createKey() {
  return key++;
}

export default function createExecution(store, config, enhancer) {

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createExecution)(store, config)
  }

  let finished = false;
  const executionKey = createKey();
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
      stepResults: []
    }
  }

  async function exe() {
    // console.log(store.getState())
    store.dispatch(startExecution(executionKey))
    const unsubscribe = store.subscribe(() => {
      let executionState = store.getState()[RRC][EXECUTION];
      if (executionState.key !== executionKey ) {
        unsubscribe();
        cancel();
      } else if (executionState.done) {
        unsubscribe();
      }
    })
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
      store.dispatch(doneExecution(executionKey, _last(context.stepResults)));
    } catch (err) {
      if (typeof errorHandler=== 'function' && !finished) {
        err = await errorHandler(err);
      }
      store.dispatch(createErrorAction(executionKey, err));
    } finally {
      unsubscribe();
    }
  }

  function done(result) {
    finished = true;
    store.dispatch(doneExecution(executionKey, result));
  }

  function redirect(path) {
    finished = true;
    store.dispatch(redirectAction(executionKey, path));
  }

  function cancel() {
    finished = true;
    store.dispatch(createCancelAction(executionKey))
  }

  return {
    schedule,
    createContext,
    exe
  }
}
