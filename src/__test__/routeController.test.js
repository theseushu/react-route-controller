import createHistory from 'history/createMemoryHistory'
import { route1, route2, route3 } from './routes';
import { createStore } from '../helpers'

import RouteController from '../routeController';

const url1 = '/user/1/item/2?name=value'

let history, store, location1;
beforeEach(() => {
  history = createHistory({initialEntries: [ url1 ]});
  store = createStore(history);
  location1 = history.location;
});

const createHandler = expectation => locationParams => {
  expectation(locationParams).toEqual({
    location: url
  })
  new Promise(resolve => setTimeout(() => {
     resolve('Pre result of route')
  }, 200))
}

describe('Route controller', () => {
  it('should throw error if store/config is not valid', () => {
    expect(() => new RouteController({}, config)).toThrow();
    expect(() => new RouteController(store, {routes: []})).toThrow();
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
    const globalError = jest.fn((err)=>console.log(err))
    const config = {
      routes: [Object.assign({}, route, { match: routeMatch })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    }
    rc = new RouteController(store, config);
    await rc.start();
    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeError).toHaveBeenCalledTimes(0);
    expect(globalMatch).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(0);
    expect(globalError).toHaveBeenCalledTimes(0);
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
      return 'Match result of route'
    })
    const globalMiss = jest.fn()
    const globalError = jest.fn((err)=>console.log(err))
    const config = {
      routes: [Object.assign({}, route, { })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    }
    rc = new RouteController(store, config);
    await rc._run(history.location);
    expect(routeMatch).toHaveBeenCalledTimes(0);
    expect(routeError).toHaveBeenCalledTimes(0);
    expect(globalMatch).toHaveBeenCalledTimes(1);
    expect(globalMiss).toHaveBeenCalledTimes(0);
    expect(globalError).toHaveBeenCalledTimes(0);
  })
  it('should process miss handler', async () => {
    let rc;
    const routeMatch = jest.fn()
    const routeError = jest.fn()
    const globalMatch = jest.fn()
    const globalMiss = jest.fn( locationParams => {
      return 'Match result of route'
    })
    const globalError = jest.fn()
    const config = {
      routes: [{
        path: '/'
      }],
      miss: globalMiss,
      error: globalError
    }
    rc = new RouteController(store, config);
    await rc._run(history.location);
    expect(routeMatch).toHaveBeenCalledTimes(0);
    expect(routeError).toHaveBeenCalledTimes(0);
    expect(globalMatch).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(1);
    expect(globalError).toHaveBeenCalledTimes(0);
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
    })
    const globalMatch = jest.fn()
    const globalMiss = jest.fn()
    const globalError = jest.fn( (err) => {
      expect(err).toEqual(error)
    })
    const config = {
      routes: [Object.assign({}, route, { match: routeMatch, error: routeError })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    }
    rc = new RouteController(store, config);
    await rc.start();

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeError).toHaveBeenCalledTimes(1);
    expect(globalMatch).toHaveBeenCalledTimes(0);
    expect(globalMiss).toHaveBeenCalledTimes(0);
    expect(globalError).toHaveBeenCalledTimes(0);

    rc.replaceConfig({
      routes: [Object.assign({}, route, { match: routeMatch })],
      match: globalMatch,
      miss: globalMiss,
      error: globalError
    })

    await rc._run(history.location);
    expect(globalError).toHaveBeenCalledTimes(1);
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
    rc = new RouteController(store, config, history);
    await rc.start();

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeMatch2).toHaveBeenCalledTimes(0);

    history.push('/'); // in this case, all function calls are sync ( every matchHandler is a sync function )

    expect(routeMatch).toHaveBeenCalledTimes(1);
    expect(routeMatch2).toHaveBeenCalledTimes(1);
  })
  it('should skip some match functions when a new route starts to run', async () => {
    const route = {
      path: '/user/:id/item/:itemId'
    }
    let rc;

    const step1 = jest.fn( locationParams => new Promise(resolve => setTimeout(() => resolve('first result'), 100)));
    const step2 = jest.fn( firstResult => {
        expect(firstResult).toEqual('first result');
        return new Promise(resolve => setTimeout(() => resolve('second result'), 100));
      })
    const step3 = jest.fn( secondResult => {
        expect(secondResult).toEqual('second result');
        return new Promise(resolve => setTimeout(() => resolve('3rd result'), 100));
      })
    const routeMatch = [ step1, step2, step3 ];
    const globalMiss = jest.fn();
    const config = {
      routes: [Object.assign({}, route, { match: routeMatch }), {
        path: '/'
      }],
      miss: globalMiss
    }
    rc = new RouteController(store, config);
    rc.start();

    await rc._run(history.location);
    await rc._run({pathname: '/'});

    expect(step1).toHaveBeenCalledTimes(2);
    expect(step2).toHaveBeenCalledTimes(1);
    expect(step3).toHaveBeenCalledTimes(1);
    expect(globalMiss).toHaveBeenCalledTimes(1);
  })
})
