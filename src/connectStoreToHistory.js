import _cloneDeep from 'lodash/cloneDeep';

import { HISTORY_CHANGED } from './createLocationReducer'

export default function connectStoreToHistory(store, history) {
  if (!store || typeof store.dispatch !== 'function')
    throw new Error('You are not passing in a redux store')
  history.listen((location, action) => {
    store.dispatch({type: HISTORY_CHANGED, payload: location})
  })
}
