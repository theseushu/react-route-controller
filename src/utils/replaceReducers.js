import { combineReducers } from 'redux';

import reducer, { RRC } from '../ducks';

const RRCReducer = {};
RRCReducer[RRC] = reducer;

export function replaceReducers(store, reducers) {
  store.replaceReducer(combineReducers({...RRCReducer, ...reducers}));
}
