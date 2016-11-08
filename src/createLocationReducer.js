import _cloneDeep from 'lodash/cloneDeep';

export const HISTORY_CHANGED = '@@history/HISTORY_CHANGED';

export const SLICE_NAME = 'currentLocation';

export default function(history) {
  let result = {};
  result[SLICE_NAME] = (state = history.location, action) => {
    return action.type === HISTORY_CHANGED ?
    _cloneDeep(action.payload) : state;
  }
  return result;
}
