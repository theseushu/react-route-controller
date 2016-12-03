import _isFunction from 'lodash/isFunction';
import _isEqual from 'lodash/isEqual';
import LocationRegistry from './locationRegistry';
import createExecution from './createExecution'
import { RRC, LOCATION, EXECUTION, startExecution, doneExecution,
  error as createErrorAction, redirect as createRedirectAction, cancel as createCancelAction } from './ducks';

let listenerKey = 10;

function createExecutionListener(store, listener) {
  const key = listenerKey++;
  let unsubscribe;
  function unsubscribeStore() {
    if (_isFunction(unsubscribe)) {
      unsubscribe();
    }
  }
  function process(params) {
    if (_isFunction(listener))
      listener(params);
  }
  let currentState;
  return {
    onStart: (execution, locationParams) => {
      store.dispatch(startExecution(execution.key));
      unsubscribe = store.subscribe(() => {
        let executionState = store.getState()[RRC][EXECUTION];
        if (!_isEqual(currentState, executionState)) {
          currentState = executionState;
          if (executionState.key !== execution.key) {
            execution.cancel();
          }
        }
      })
      process({done: false, locationParams})
    },
    onDone: (execution, result) => {
      unsubscribeStore();
      store.dispatch(doneExecution(execution.key));
      process({done: true, result});
    },
    onError: (execution, err) => {
      unsubscribeStore();
      store.dispatch(createErrorAction(execution.key, err));
      process({done: true, error: err});
    },
    onCancel: (execution) => {
      unsubscribeStore();
      store.dispatch(createCancelAction(execution.key))
      process({done: true, cancelled: true});
    },
    onRedirect: (execution, redirect) => {
      unsubscribeStore();
      store.dispatch(createRedirectAction(execution.key, redirect));
      process({done: true, redirect});
    }
  }
}

export default function createRouteController(config) {
  let stores = new Set();

  let { routes, ...globalConfig } = config;
  if (routes.length === 0)
    throw new Error('You donot have any routes defined');
  let _routes = routes;
  let _globalConfig = globalConfig;
  let _locationRegistry = new LocationRegistry(_routes);

  function start(store, listener) { // stop = route.start(); stop();
    if (stores.has(store))
      throw new Error('DO NOT call start with the same store twice! You can stop former run (const stop = store.start(); stop()), then start again ')
    stores.add(store);
    let location = store.getState()[RRC][LOCATION];
    const unsubscribe = store.subscribe(() => {
      const nextLocation = store.getState()[RRC][LOCATION];
      if (nextLocation.key !== location.key) {
        location = nextLocation;
        _execute(store, location, listener);
      }
    })
    _execute(store, location, listener);
    return (() => {
      unsubscribe();
      stores.delete(store)
    })
  }

  function _execute(store, location, listener) {
    const result = _locationRegistry.match(location); //{locationParams, route}
    let config = {}
    if (result) {
      config = {
        ...result,
        ..._globalConfig
      }
    } else {
      config = {
        locationParams: {
          location
        },
        ..._globalConfig
      }
    }
    const executionListener = createExecutionListener(store, listener);
    createExecution(config, executionListener, {store}).exe();
  }

  function replaceConfig({ routes, ...globalConfig }) {
    _routes = routes;
    _globalConfig = globalConfig;
    _locationRegistry = new LocationRegistry(_routes);
  }

  return {
    start,
    replaceConfig
  }
}
