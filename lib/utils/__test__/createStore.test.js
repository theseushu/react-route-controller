'use strict';

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _ducks = require('../../ducks');

var _createStore = require('../createStore');

var _createStore2 = _interopRequireDefault(_createStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('createStore', function () {
  it('creates a redux store with rrc reducers', function () {
    var pathname = '/test/url';

    var history = (0, _createMemoryHistory2.default)();

    var store = (0, _createStore2.default)(history);

    expect(store.getState()[_ducks.RRC][_ducks.LOCATION]).toEqual(history.location);
    expect(store.getState()[_ducks.RRC][_ducks.EXECUTION]).toEqual({});

    history.push(pathname);

    expect(store.getState()[_ducks.RRC][_ducks.LOCATION]).toEqual(history.location);
    expect(store.getState()[_ducks.RRC][_ducks.LOCATION].pathname).toEqual(pathname);
    expect(store.getState()[_ducks.RRC][_ducks.EXECUTION]).toEqual({});
  });
  it('works with other reducers', function () {
    var history = (0, _createMemoryHistory2.default)();
    var reducers = {
      a: function a() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'a';
        var action = arguments[1];
        return action.type === 'A' ? action.payload : state;
      },
      b: function b() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'b';
        var action = arguments[1];
        return action.type === 'B' ? action.payload : state;
      }
    };
    var store = (0, _createStore2.default)(history, reducers);

    expect(store.getState()[_ducks.RRC][_ducks.LOCATION]).toEqual(history.location);
    expect(store.getState()[_ducks.RRC][_ducks.EXECUTION]).toEqual({});
    expect(store.getState().a).toEqual('a');
    expect(store.getState().b).toEqual('b');

    store.dispatch({ type: 'A', payload: 'a2' });
    store.dispatch({ type: 'B', payload: 'b2' });

    expect(store.getState()[_ducks.RRC][_ducks.LOCATION]).toEqual(history.location);
    expect(store.getState()[_ducks.RRC][_ducks.EXECUTION]).toEqual({});
    expect(store.getState().a).toEqual('a2');
    expect(store.getState().b).toEqual('b2');
  });
});