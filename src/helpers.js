import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers } from 'redux';

import createLocationReducer, { SLICE_NAME } from './createLocationReducer';


export function createStore(history, reducers = {}, preloadedState = {}, enhancer = undefined) {
  const store = reduxCreateStore(
    combineReducers(Object.assign({}, reducers, createLocationReducer(history))),
    preloadedState,
    enhancer
  );
  return store;
}

export function replaceReducers(history, store, reducers) {
  reducers[SLICE_NAME] = createLocationReducer(history);
  store.replaceReducer(Object.assign({}, reducers, createLocationReducer(history)));
}
