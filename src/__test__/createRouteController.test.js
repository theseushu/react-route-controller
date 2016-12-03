import createHistory from 'history/createMemoryHistory'
import { route1, route2, route3 } from './routes';
import createStore from '../utils/createStore'
import { RRC, EXECUTION } from '../ducks'

import createRouteController from '../createRouteController';

const url = '/user/1/item/2?name=value'

let history, store, location1;
beforeEach(() => {
  history = createHistory({initialEntries: [ url ]});
  store = createStore(history);
  location1 = history.location;
});

describe('Route controller', () => {
  it('should throw error if config is not valid', () => {
    expect(() => createRouteController({routes: []})).toThrow();
  })
  it('should process routes handler', async () => {
    const route = {
      path: '/user/:id/item/:itemId'
    }
    let rc;
    const routeMatch = jest.fn( locationParams => {
      expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' })
      expect(locationParams.queryParams).toEqual({ name: 'value' })
      return 'Match result of route'
    })
    const routeError = jest.fn()
    const globalMatch = jest.fn()
    const globalMiss = jest.fn()
    const globalError = jest.fn((err)=>{})
    const config = {
      routes: [Object.assign({}, route, { match: routeMatch })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    }
    rc = createRouteController(config);
    const listener = jest.fn(({done, ...params}) => {
      if (done) {
        expect(params).toEqual({result: 'Match result of route'})
      } else {
        expect(params).toEqual({
          locationParams: {
            location: history.location,
            pathVariables: {id: '1', itemId: '2'},
            queryParams: {name: 'value'}
          }
        })
      }
    });
    await rc.start(store, listener);

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeError).toHaveBeenCalledTimes(0);
    expect(globalMatch).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(0);
    expect(globalError).toHaveBeenCalledTimes(0);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({
      done: false,
      locationParams: {
        location: history.location,
        pathVariables: {id: '1', itemId: '2'},
        queryParams: {name: 'value'}
      }
    });
    expect(listener).toHaveBeenLastCalledWith({done: true, result: 'Match result of route'});
  })
  it('should process global handler', async () => {
    const route = {
      path: '/user/:id/item/:itemId'
    }
    let rc;
    const routeMatch = jest.fn()
    const routeError = jest.fn()
    const globalMatch = jest.fn( locationParams => {
      expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' })
      expect(locationParams.queryParams).toEqual({ name: 'value' })
      return 'Match result of global'
    })
    const globalMiss = jest.fn()
    const globalError = jest.fn((err)=>{})
    const config = {
      routes: [Object.assign({}, route, { })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    }
    const listener = jest.fn();
    rc = createRouteController(config);
    await rc.start(store, listener);
    expect(routeMatch).toHaveBeenCalledTimes(0);
    expect(routeError).toHaveBeenCalledTimes(0);
    expect(globalMatch).toHaveBeenCalledTimes(1);
    expect(globalMiss).toHaveBeenCalledTimes(0);
    expect(globalError).toHaveBeenCalledTimes(0);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({
      done: false,
      locationParams: {
        location: history.location,
        pathVariables: {id: '1', itemId: '2'},
        queryParams: {name: 'value'}
      }
    });
    expect(listener).toHaveBeenLastCalledWith({done: true, result: 'Match result of global'});
  })
  it('should process miss handler', async () => {
    let rc;
    const routeMatch = jest.fn()
    const routeError = jest.fn()
    const globalMatch = jest.fn()
    const globalMiss = jest.fn( locationParams => {
      return 'Miss result of route'
    })
    const globalError = jest.fn()
    const config = {
      routes: [{
        path: '/'
      }],
      miss: globalMiss,
      error: globalError
    }
    rc = createRouteController(config);
    const listener = jest.fn();
    await rc.start(store, listener);
    expect(routeMatch).toHaveBeenCalledTimes(0);
    expect(routeError).toHaveBeenCalledTimes(0);
    expect(globalMatch).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(1);
    expect(globalError).toHaveBeenCalledTimes(0);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({
      done: false,
      locationParams: {
        location: history.location
      }
    });
    expect(listener).toHaveBeenLastCalledWith({done: true, result: 'Miss result of route'});
  })
  it('should process right error handler', async () => {
    const route = {
      path: '/user/:id/item/:itemId'
    }
    let rc;
    const error = new Error('error');
    const routeMatch = jest.fn( locationParams => {
      expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' })
      expect(locationParams.queryParams).toEqual({ name: 'value' })
      throw error;
    })
    const routeError = jest.fn( (err) => {
      expect(err).toEqual(error)
      return error
    })
    const globalMatch = jest.fn()
    const globalMiss = jest.fn()
    const globalError = jest.fn( (err) => {
      expect(err).toEqual(error);
      return error
    })
    const config = {
      routes: [Object.assign({}, route, { match: routeMatch, error: routeError })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    }
    rc = createRouteController(config);
    const listener = jest.fn();
    const stop = await rc.start(store, listener);

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeError).toHaveBeenCalledTimes(1);
    expect(globalMatch).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(0);
    expect(globalError).toHaveBeenCalledTimes(0);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith({done: true, error});

    stop();
    rc.replaceConfig({
      routes: [Object.assign({}, route, { match: routeMatch })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    })

    await rc.start(store, listener);

    expect(globalError).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(4);
    expect(listener).toHaveBeenLastCalledWith({done: true, error});
  })
  it('should response to history', async () => {
    let rc;
    const error = new Error('error');
    const routeMatch = jest.fn( locationParams => {
      expect(locationParams.pathVariables).toEqual({ id: '1', itemId: '2' })
      expect(locationParams.queryParams).toEqual({ name: 'value' })
    })
    const routeMatch2 = jest.fn( locationParams => {
      expect(locationParams.pathVariables).toEqual({})
      expect(locationParams.queryParams).toEqual({})
    })
    const config = {
      routes: [{
        path: '/user/:id/item/:itemId',
        match: routeMatch
      }, {
        path: '/',
        match: routeMatch2
      }],
    }
    rc = createRouteController(config, history);
    const listener = jest.fn();
    await rc.start(store, listener);

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeMatch2).toHaveBeenCalledTimes(0);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith({done: true});

    await history.push('/') // in this case, all function calls are sync ( every matchHandler is a sync function )

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeMatch2).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(4);
    expect(listener).toHaveBeenLastCalledWith({done: true});
  })
  it('should skip some match functions when a new route starts to run', async () => {
    const route = {
      path: '/user/:id/item/:itemId'
    }
    let rc;

    const step1 = jest.fn(async (params, context) => {
      return 'step1'
    })
    const step2 = jest.fn(async (params, context) => {
      return 'step2'
    })
    const routeMatch = [ step1, step2 ];
    const globalMiss = jest.fn();
    const config = {
      routes: [
        Object.assign({}, route, { match: routeMatch }),
        {
          path: '/'
        }
      ],
      miss: globalMiss
    }
    rc = createRouteController(config, history);
    const listener = jest.fn();
    rc.start(store, listener);
    expect(listener).toHaveBeenCalledTimes(1);
    await history.push('/')

    expect(step1).toHaveBeenCalledTimes(1);
    expect(step2).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(4);
    expect(listener).toHaveBeenLastCalledWith({done: true});
  })
  it('should run with multiple stores', async () => {
    const url1 = '/user/2/item/3?name2=value2';
    const url2 = '/';
    const url3 = '/users?name3=value3';
    const history1 = createHistory({initialEntries: [ url ]});
    const history2 = createHistory({initialEntries: [ url ]});
    const history3 = createHistory({initialEntries: [ url ]});
    const store1 = createStore(history1);
    const store2 = createStore(history2);
    const store3 = createStore(history3);

    const route1Match = jest.fn((locationParams) => {
      return 'result1'
    })
    const route2Match = jest.fn((locationParams) => {
      expect(locationParams.pathVariables).toEqual({})
      expect(locationParams.queryParams).toEqual({ name3: 'value3' })
      return 'result2'
    })

    const miss = jest.fn((locationParams) => {
      return 'missing'
    })
    const config = {
      routes: [
        {
          path: '/user/:id/item/:itemId',
          match: route1Match
        },
        {
          path: '/users',
          match: route2Match
        }
      ],
      miss: miss
    }
    const rc = createRouteController(config);
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();
    await rc.start(store1, listener1);
    await rc.start(store2, listener2);
    await rc.start(store3, listener3);

    expect(route1Match).toHaveBeenCalledTimes(3)
    expect(route2Match).toHaveBeenCalledTimes(0)
    expect(miss).toHaveBeenCalledTimes(0)

    await history1.push(url1)
    await history2.push(url2)
    await history3.push(url3)
    expect(route1Match).toHaveBeenCalledTimes(4)
    expect(route2Match).toHaveBeenCalledTimes(1)
    expect(miss).toHaveBeenCalledTimes(1)
    expect(store1.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(store2.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(store3.getState()[RRC][EXECUTION].state.done).toEqual(true)
    expect(listener1).toHaveBeenCalledTimes(4)
    expect(listener1).toHaveBeenLastCalledWith({done: true, result: 'result1'});
    expect(listener2).toHaveBeenCalledTimes(4)
    expect(listener2).toHaveBeenLastCalledWith({done: true, result: 'missing'});
    expect(listener3).toHaveBeenCalledTimes(4)
    expect(listener3).toHaveBeenLastCalledWith({done: true, result: 'result2'});
  })
})
