import _cloneDeep from 'lodash/cloneDeep';

import { LOCATION_CHANGED } from '../ducks'

//dispatch a LOCATION_CHANGED at once, then subscribe store to history, dispatch LOCATION_CHANGED actions whenever location changes
export default function connectStoreToHistory(store, history) {
  if (!store || typeof store.dispatch !== 'function')
    throw new Error('You are not passing in a redux store')

  store.dispatch({type: LOCATION_CHANGED, payload: history.location})
  
  history.listen((location, action) => {
    store.dispatch({type: LOCATION_CHANGED, payload: location})
  })
}
