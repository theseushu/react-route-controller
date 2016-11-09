import {createStore, replaceReducers} from './helpers';
import locationRegistry from './locationRegistry';
import createLocationReducer, { HISTORY_CHANGED, SLICE_NAME } from './createLocationReducer'
import connectStoreToHistory from './connectStoreToHistory'
import routeController from './routeController';

export default routeController;
export {
  connectStoreToHistory,
  createLocationReducer,
  HISTORY_CHANGED,
  SLICE_NAME,
  locationRegistry,
  createStore,
  replaceReducers
}
