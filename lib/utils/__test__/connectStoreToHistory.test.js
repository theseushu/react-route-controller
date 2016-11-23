'use strict';

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _ducks = require('../../ducks');

var _connectStoreToHistory = require('../connectStoreToHistory');

var _connectStoreToHistory2 = _interopRequireDefault(_connectStoreToHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('connectStoreToHistory', function () {
  it('connects store to history', function () {
    var pathname = '/test/url';
    var mockDispatch = jest.fn(function (_ref) {
      var type = _ref.type,
          payload = _ref.payload;

      expect(type).toEqual(_ducks.LOCATION_CHANGED);
    });
    var store = {
      dispatch: mockDispatch
    };

    var history = (0, _createMemoryHistory2.default)();

    (0, _connectStoreToHistory2.default)(store, history);

    history.push(pathname);

    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });
});