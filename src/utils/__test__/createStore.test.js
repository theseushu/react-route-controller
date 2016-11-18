import createHistory from 'history/createMemoryHistory';
import { LOCATION_CHANGED, RRC, LOCATION, EXECUTION } from '../../ducks';
import createStore from '../createStore';

describe('createStore', () => {
  it('creates a redux store with rrc reducers', () => {
    const pathname = '/test/url';

    const history = createHistory();

    const store = createStore(history);

    expect(store.getState()[RRC][LOCATION]).toEqual(history.location)
    expect(store.getState()[RRC][EXECUTION]).toEqual({})

    history.push(pathname)

    expect(store.getState()[RRC][LOCATION]).toEqual(history.location)
    expect(store.getState()[RRC][LOCATION].pathname).toEqual(pathname)
    expect(store.getState()[RRC][EXECUTION]).toEqual({})
  })
  it('works with other reducers', () => {
    const history = createHistory();
    const reducers = {
      a: (state='a', action) => action.type === 'A' ? action.payload : state,
      b: (state='b', action) => action.type === 'B' ? action.payload : state
    }
    const store = createStore(history, reducers);

    expect(store.getState()[RRC][LOCATION]).toEqual(history.location)
    expect(store.getState()[RRC][EXECUTION]).toEqual({})
    expect(store.getState().a).toEqual('a')
    expect(store.getState().b).toEqual('b')

    store.dispatch({type: 'A', payload: 'a2'})
    store.dispatch({type: 'B', payload: 'b2'})

    expect(store.getState()[RRC][LOCATION]).toEqual(history.location)
    expect(store.getState()[RRC][EXECUTION]).toEqual({})
    expect(store.getState().a).toEqual('a2')
    expect(store.getState().b).toEqual('b2')
  })
})
