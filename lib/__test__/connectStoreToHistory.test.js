'use strict';

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _connectStoreToHistory = require('../connectStoreToHistory');

var _connectStoreToHistory2 = _interopRequireDefault(_connectStoreToHistory);

var _createLocationReducer = require('../createLocationReducer');

var _createLocationReducer2 = _interopRequireDefault(_createLocationReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = void 0;
beforeEach(function () {
  return history = (0, _createMemoryHistory2.default)({ initialEntries: ['/test?name=value'] });
});

describe('Connect store to history', function () {
  it('should recognise a redux store', function () {
    expect(function () {
      return (0, _connectStoreToHistory2.default)({}, history);
    }).toThrow();
    expect(function () {
      return (0, _connectStoreToHistory2.default)({ dispatch: 'a' }, history);
    }).toThrow();
    expect(function () {
      return (0, _connectStoreToHistory2.default)({ dispatch: function dispatch() {
          return 1;
        } }, null);
    }).toThrow();
  });
  it('should response to history events', function () {
    var reducer = (0, _createLocationReducer2.default)(history);
    var mockStore = {
      dispatch: function dispatch(action) {
        expect(action).toEqual({
          type: _createLocationReducer.HISTORY_CHANGED,
          payload: history.location
        });
      }
    };
    (0, _connectStoreToHistory2.default)(mockStore, history);
    history.push('/test2?name2=value2', { a: 'a' });
  });
});