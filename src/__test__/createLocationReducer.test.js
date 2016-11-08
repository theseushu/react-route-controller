import createLocationReducer, { HISTORY_CHANGED, SLICE_NAME } from '../createLocationReducer';
import createHistory from 'history/createMemoryHistory';

let history;
beforeEach(() => history = createHistory({initialEntries: [ '/test?name=value' ]}));

describe('Location reducer', () => {
  it('should throw an error when history is not proper', () => {
    expect(createLocationReducer()).toThrow()
  })
  it('should return the initial state', () => {
    const reducer = createLocationReducer(history)[SLICE_NAME];
    expect(reducer(undefined, { })).toEqual({
      pathname: '/test',
      search: '?name=value',
      hash: '',
      state: undefined,
      key: undefined
    })
  })
  it(`should handle ${HISTORY_CHANGED}`, () => {
    const reducer = createLocationReducer(history)[SLICE_NAME];
    const location = {
      pathname: '/test1',
      search: 'name1=value1'
    }
    expect(reducer({}, { type: HISTORY_CHANGED, payload: location })).toEqual(location)
  })
});
