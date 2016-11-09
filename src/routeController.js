import _matches from 'lodash/matches'
import LocationRegistry from './locationRegistry';
import { SLICE_NAME } from './createLocationReducer';
import connectStoreToHistory from './connectStoreToHistory';

export default class RouteController {

  static async _runMatch(counter, controller, locationParams, match) {
    if ( Array.isArray(match) ) {
      let nextParam = locationParams;
      for (let step of match) {
        if (step == null) {
          continue;
        } else if (controller._validateCounter(counter)) {
          nextParam = (typeof step === 'function' ? await step(nextParam) : step)
        } else {
          if (process.env.NODE_ENV !== 'production')
            console.log('Routing disrupted due to new requests')
        }
      }
      return nextParam;
    } else if (typeof match === 'function') {
      await match(locationParams);
    }
    else {
      if (process.env.NODE_ENV !== 'production')
        console.warn('Currently, match supports single or an array of (async)functions only')
    }
  }

  static async _runMiss(locationParams, miss) {
    if (typeof miss === 'function') {
      await miss(locationParams);
    }
    else
      if (process.env.NODE_ENV !== 'production')
        console.error('Theres no "miss" handler')
  }

  static async _navigate(counter, controller, locationParams, match, miss, error) {
    try {
      if (match) {
        await RouteController._runMatch(counter, controller, locationParams, match);
      }
      else {
        await RouteController._runMiss(locationParams, miss);
      }
    } catch (err) {
      if (typeof error === 'function')
        return await error(err)
      else
        if (process.env.NODE_ENV !== 'production')
          console.error(err)
    }
  }

  _history;
  _store;
  _locationRegistry;
  _location;
  _globalHandlers;
  _counter = 0;

  constructor(store, config, history) {
    if (!store || typeof store.subscribe !== 'function' || typeof store.getState !== 'function')
      throw new Error('You are not passing in a redux store');
    if (config.routes.length === 0)
      throw new Error('You donot have any routes defined');
    this._store = store;
    if (history) {
      this._history = history;
      connectStoreToHistory(this._store, this._history);
    }
    //TODO validate config
    this._locationRegistry = new LocationRegistry(config.routes);
    let { match, miss, error } = config;
    this._globalHandlers = { match, miss, error };
  }

  get history() {
    return this._history;
  }

  async replaceConfig(config) {
    this._locationRegistry.replaceRoutes(config.routes);
    let { match, miss, error } = config;
    this._globalHandlers = { match, miss, error };
    await this._run(this._location)
  }

  _validateCounter(counter) {
    return counter === this._counter;
  }

  _run = async location => {
    const route = this._locationRegistry.match(location) || {};

    let matchHandler, errorHandler, missHandler, pathVariables, queryParams;
    if (route == null) {
      matchHandler = this._globalHandlers.match;
      errorHandler = this._globalHandlers.error;
    } else {
      const { match, error } = route;
      pathVariables = route.pathVariables;
      queryParams = route.queryParams;
      matchHandler = match ? match : this._globalHandlers.match;
      errorHandler = error ? error : this._globalHandlers.error;
    }
    missHandler = this._globalHandlers.miss;
    const counter = ++this._counter;
    const locationParams = { location, pathVariables, queryParams }
    await RouteController._navigate(counter, this, locationParams, matchHandler, missHandler, errorHandler);
  }

  async start() {
    this._store.subscribe(() => {
      const location = (this._store.getState()[SLICE_NAME]);
      this._location = location;
      this._run(this._location);
    })
    this._location = this._store.getState()[SLICE_NAME];
    await this._run(this._location);
  }
}
