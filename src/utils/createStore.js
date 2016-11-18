import { createStore as reduxCreateStore, combineReducers } from 'redux';

import reducer, { RRC } from '../ducks';
import connectStoreToHistory from './connectStoreToHistory';

const RRCReducer = {};
RRCReducer[RRC] = reducer;

export default function createStore(history, reducers = {}, preloadedState = {}, enhancer = undefined) {
  const store = reduxCreateStore(
    combineReducers({...RRCReducer, ...reducers}),
    preloadedState,
    enhancer
  );
  connectStoreToHistory(store, history);
  return store;
}
