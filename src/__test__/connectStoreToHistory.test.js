import createHistory from 'history/createMemoryHistory';

import connectStoreToHistory from '../connectStoreToHistory';
import createLocationReducer, { HISTORY_CHANGED } from '../createLocationReducer';

let history;
beforeEach(() => history = createHistory({initialEntries: [ '/test?name=value' ]}));

describe('Connect store to history', () => {
  it('should recognise a redux store', () => {
    expect(() => connectStoreToHistory({}, history)).toThrow();
    expect(() => connectStoreToHistory({dispatch: 'a'}, history)).toThrow();
    expect(() => connectStoreToHistory({dispatch: () => 1}, null)).toThrow();
  })
  it('should response to history events', () => {
    const reducer = createLocationReducer(history);
    const mockStore = {
      dispatch: (action) => {
        expect(action).toEqual({
          type: HISTORY_CHANGED,
          payload: history.location
        })
      }
    }
    connectStoreToHistory(mockStore, history);
    history.push('/test2?name2=value2', {a: 'a'})
  })
})
