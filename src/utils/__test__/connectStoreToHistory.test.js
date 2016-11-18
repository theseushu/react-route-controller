import createHistory from 'history/createMemoryHistory';
import { LOCATION_CHANGED } from '../../ducks';
import connectStoreToHistory from '../connectStoreToHistory';

describe('connectStoreToHistory', () => {
  it('connects store to history', () => {
    const pathname = '/test/url';
    const mockDispatch = jest.fn(({type, payload}) => {
      expect(type).toEqual(LOCATION_CHANGED);
    })
    const store = {
      dispatch: mockDispatch
    }

    const history = createHistory();

    connectStoreToHistory(store, history);

    history.push(pathname)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
  })
})
