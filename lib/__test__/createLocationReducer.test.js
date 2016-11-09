'use strict';

var _createLocationReducer = require('../createLocationReducer');

var _createLocationReducer2 = _interopRequireDefault(_createLocationReducer);

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = void 0;
beforeEach(function () {
  return history = (0, _createMemoryHistory2.default)({ initialEntries: ['/test?name=value'] });
});

describe('Location reducer', function () {
  it('should throw an error when history is not proper', function () {
    expect((0, _createLocationReducer2.default)()).toThrow();
  });
  it('should return the initial state', function () {
    var reducer = (0, _createLocationReducer2.default)(history)[_createLocationReducer.SLICE_NAME];
    expect(reducer(undefined, {})).toEqual({
      pathname: '/test',
      search: '?name=value',
      hash: '',
      state: undefined,
      key: undefined
    });
  });
  it('should handle ' + _createLocationReducer.HISTORY_CHANGED, function () {
    var reducer = (0, _createLocationReducer2.default)(history)[_createLocationReducer.SLICE_NAME];
    var location = {
      pathname: '/test1',
      search: 'name1=value1'
    };
    expect(reducer({}, { type: _createLocationReducer.HISTORY_CHANGED, payload: location })).toEqual(location);
  });
});