import _matches from 'lodash/matches'
import LocationRegistry from './locationRegistry';
import { RRC, LOCATION, EXECUTION } from './ducks';
import createExecution from './createExecution'

export default function createRouteController(config) {
  let stores = new Set();

  let { routes, ...globalConfig } = config;
  if (routes.length === 0)
    throw new Error('You donot have any routes defined');
  let _routes = routes;
  let _globalConfig = globalConfig;
  let _locationRegistry = new LocationRegistry(_routes);

  function start(store) { // stop = route.start(); stop();
    if (stores.has(store))
      throw new Error('DO NOT call start with the same store twice! You can stop former run (const stop = store.start(); stop()), then start again ')
    stores.add(store);
    let location = store.getState()[RRC][LOCATION];
    const unsubscribe = store.subscribe(() => {
      const nextLocation = store.getState()[RRC][LOCATION];
      if (nextLocation.key !== location.key) {
        location = nextLocation;
        _execute(store, location);
      }
    })
    _execute(store, location);
    return (() => {
      unsubscribe();
      stores.delete(store)
    })
  }

  function _execute(store, location) {
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
    createExecution(store, config).exe();
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
