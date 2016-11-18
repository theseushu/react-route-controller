import _entries from 'lodash/entries'
import _isFunction from 'lodash/isFunction'

/**
 * nest object will be treat as a simple value
 */

export default function convertObjectToAsyncFunction(obj) {
  return async function(...params) {
    let result = {};
    let entryKeys = [];
    let entryValues = [];
    _entries(obj).forEach(([key, value]) => {
      entryKeys.push(key);
      if (_isFunction(value)) {
        entryValues.push(value(...params));
      } else {
        entryValues.push(value)
      }
    })
    const entryResults = await Promise.all(entryValues);
    entryKeys.forEach((key, i) => {
      result[key] = entryResults[i];
    })
    return result;
  }
}
