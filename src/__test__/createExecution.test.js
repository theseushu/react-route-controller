import createHistory from 'history/createMemoryHistory';
import createStore from '../utils/createStore';

import createExecution from '../createExecution';

import { RRC, EXECUTION, startExecution, doneExecution,
  error as createErrorAction, redirect as createRedirectAction, cancel as createCancelAction } from '../ducks'


let history, store, listener;

beforeEach(() => {

  history = createHistory({});
  store = createStore(history);
  listener = {
    onStart: (execution) => {
      store.dispatch(startExecution(execution.key));
    },
    onDone: (execution, result) => {
      store.dispatch(doneExecution(execution.key, result));
    },
    onError: (execution, err) => {
      store.dispatch(createErrorAction(execution.key, err));
    },
    onCancel: (execution) => {
      store.dispatch(createCancelAction(execution.key))
    },
    onRedirect: (execution, redirect) => {
      store.dispatch(createRedirectAction(execution.key, redirect));
    }
  }
});


describe('createExecution', () => {
  it('creates an execution sequence and execute it', async () => {
    const locationParams = {
      location: history.location
    }
    const step1 = jest.fn(async (params, context) => {
      expect(params).toEqual(context.locationParams)
      let { location, pathVariables, queryParams } = context.locationParams
      expect(location).toEqual(history.location)
      return 'step1'
    })
    const step2First = jest.fn(async (params, context) => {
      expect(params).toEqual('step1')
      let { location, pathVariables, queryParams } = context.locationParams
      expect(location).toEqual(history.location)
      return 'step2 first'
    })
    const step2Second = jest.fn((params, context) => {
      expect(params).toEqual('step1')
      let { location, pathVariables, queryParams } = context.locationParams
      expect(location).toEqual(history.location)
    })
    const step3 = jest.fn(async (params, context) => {
      expect(params).toEqual({ first: 'step2 first', second: undefined, third: 'step2 third' })
      let { location, pathVariables, queryParams } = context.locationParams
      expect(location).toEqual(history.location)
      return 'step3'
    })
    const config = {
      locationParams,
      route: {
        match: [
          step1,
          {
            first: step2First,
            second: step2Second,
            third: 'step2 third'
          },
          step3,
          'step4'
        ]
      }
    }
    await createExecution(config, listener).exe()
    expect(step1).toHaveBeenCalledTimes(1)
    expect(step2First).toHaveBeenCalledTimes(1)
    expect(step2Second).toHaveBeenCalledTimes(1)
    expect(step3).toHaveBeenCalledTimes(1)
    expect(store.getState()[RRC][EXECUTION].state.result).toEqual('step4')
    expect(store.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(store.getState()[RRC][EXECUTION].state.cancel).toBeUndefined()
    expect(store.getState()[RRC][EXECUTION].state.redirect).toBeUndefined()
  })

  it('run execution control methods', async () => {
    const locationParams = {
      location: history.location
    }
    const step1done = jest.fn(async (params, context) => {
      context.done('stop execution now');
      return 'step1'
    })
    const step2 = jest.fn(async (params, context) => {
      return 'step2 first'
    })
    let config = {
      locationParams,
      route: {
        match: [
          step1done,
          step2
        ]
      }
    }
    await createExecution(config, listener).exe()
    expect(step1done).toHaveBeenCalledTimes(1)
    expect(step2).toHaveBeenCalledTimes(0)
    expect(store.getState()[RRC][EXECUTION].state.result).toEqual('stop execution now')

    const step1cancel = jest.fn(async (params, context) => {
      context.cancel();
      return 'step1'
    })
    config = {
      locationParams,
      route: {
        match: [
          step1cancel,
          step2
        ]
      }
    }
    await createExecution(config, listener).exe()
    expect(step1cancel).toHaveBeenCalledTimes(1)
    expect(step2).toHaveBeenCalledTimes(0)
    expect(store.getState()[RRC][EXECUTION].state.cancelled).toEqual(true)

    const step1redirect = jest.fn(async (params, context) => {
      context.redirect('///');
      return 'step1'
    })
    config = {
      locationParams,
      route: {
        match: [
          step1redirect,
          step2
        ]
      }
    }
    await createExecution(config, listener).exe()
    expect(step1redirect).toHaveBeenCalledTimes(1)
    expect(step2).toHaveBeenCalledTimes(0)
    expect(store.getState()[RRC][EXECUTION].state.redirect).toEqual('///')
  })

  it('cancel current execution if theres a new one', async () => {
    let config;
    const locationParams = {
      location: history.location
    }
    const step1 = jest.fn(async (params, context) => {
      return 'step1'
    })
    const step2 = jest.fn(async (params, context) => {
      return 'step2'
    })
    config = {
      locationParams,
      route: {
        match: [
          step1,
          step2
        ]
      }
    }
    listener.onStart = (execution) => {
      const unsubscribe = store.subscribe(() => {
        let executionState = store.getState()[RRC][EXECUTION];
        if (executionState.key !== execution.key ) {
          unsubscribe();
          execution.cancel();
        } else if (executionState.done) {
          unsubscribe();
        }
      })
      store.dispatch(startExecution(execution.key));
    };
    createExecution(config, listener).exe();

    let executionKey = store.getState()[RRC][EXECUTION].key;
    await createExecution(config, listener).exe()
    expect(step1).toHaveBeenCalledTimes(2)
    expect(step2).toHaveBeenCalledTimes(1)
    expect(store.getState()[RRC][EXECUTION].key).toEqual(executionKey + 1)
  })
  it('chooses right match handler', async () => {
    const locationParams = {
      location: history.location
    }
    const routeMatch = jest.fn();
    const globalMatch = jest.fn();
    const routeError = jest.fn();
    const globalError = jest.fn();
    const miss = jest.fn();
    let config = {
      locationParams,
      route: {
        match: routeMatch,
        error: routeError
      },
      error: globalError,
      miss,
      match: globalMatch
    }
    await createExecution(config, listener).exe()
    expect(routeMatch).toHaveBeenCalledTimes(1)
    expect(globalMatch).toHaveBeenCalledTimes(0)
    expect(routeError).toHaveBeenCalledTimes(0)
    expect(globalError).toHaveBeenCalledTimes(0)
    expect(miss).toHaveBeenCalledTimes(0)
    config = {
      locationParams,
      route: {
        error: routeError
      },
      error: globalError,
      miss,
      match: globalMatch
    }
    await createExecution(config, listener).exe()
    expect(routeMatch).toHaveBeenCalledTimes(1)
    expect(globalMatch).toHaveBeenCalledTimes(1)
    expect(routeError).toHaveBeenCalledTimes(0)
    expect(globalError).toHaveBeenCalledTimes(0)
    expect(miss).toHaveBeenCalledTimes(0)
  })

  it('chooses right error handler', async () => {
    const locationParams = {
      location: history.location
    }
    const error = new Error();
    const routeMatch = jest.fn(() => { throw error });
    const routeError = jest.fn((err) => {
      expect(err).toEqual(error)
      return 'route error'
    });
    const globalError = jest.fn((err) => {
      expect(err).toEqual(error)
      return 'global error'
    });
    let config = {
      locationParams,
      route: {
        match: routeMatch,
        error: routeError
      },
      error: globalError,
    }
    await createExecution(config, listener).exe()
    expect(routeMatch).toHaveBeenCalledTimes(1)
    expect(routeError).toHaveBeenCalledTimes(1)
    expect(globalError).toHaveBeenCalledTimes(0)
    expect(store.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(store.getState()[RRC][EXECUTION].state.error).toEqual('route error')
    config = {
      locationParams,
      route: {
        match: routeMatch,
      },
      error: globalError,
    }
    await createExecution(config, listener).exe()
    expect(routeMatch).toHaveBeenCalledTimes(2)
    expect(routeError).toHaveBeenCalledTimes(1)
    expect(globalError).toHaveBeenCalledTimes(1)
    expect(store.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(store.getState()[RRC][EXECUTION].state.error).toEqual('global error')
  })

  it('run miss handler where theres no matching route', async () => {
    const locationParams = {
      location: history.location
    }
    const error = new Error();
    const globalError = jest.fn((err) => {
      expect(err).toEqual(error)
      return 'error'
    });
    const miss = jest.fn(async (params, context) => {
      expect(params).toEqual(context.locationParams)
      let { location, pathVariables, queryParams } = context.locationParams
      expect(location).toEqual(history.location)
      throw error
    })
    let config = {
      locationParams,
      miss,
      error: globalError,
    }
    await createExecution(config, listener).exe()
    expect(miss).toHaveBeenCalledTimes(1)
    expect(globalError).toHaveBeenCalledTimes(1)
    expect(store.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(store.getState()[RRC][EXECUTION].state.error).toEqual('error')
  })
})
