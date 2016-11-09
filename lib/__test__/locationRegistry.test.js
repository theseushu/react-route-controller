'use strict';

var _locationRegistry = require('../locationRegistry');

var _locationRegistry2 = _interopRequireDefault(_locationRegistry);

var _routes = require('./routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [_routes.route1, _routes.route2, _routes.route3];

describe('LocationRegistry tests', function () {
  it('should throw error if route is not proper', function () {
    var locationRegistry = new _locationRegistry2.default(routes);

    expect(function () {
      return new _locationRegistry2.default([_routes.route1, {}]);
    }).toThrowError('Path must be defined in route or route.pattern!');
  });

  it('should handle match properly', function () {
    var locationRegistry = new _locationRegistry2.default(routes);

    function getHandlers(pathname) {
      var _locationRegistry$mat = locationRegistry.match({ pathname: pathname }),
          pre = _locationRegistry$mat.pre,
          match = _locationRegistry$mat.match,
          post = _locationRegistry$mat.post,
          error = _locationRegistry$mat.error;

      return { pre: pre, match: match, post: post, error: error };
    }
    expect(getHandlers('/')).toEqual({ pre: _routes.route1.pre, match: _routes.route1.match, post: _routes.route1.post, error: _routes.route1.error });
    expect(locationRegistry.match({ pathname: '/user/2/item/1' }).pathVariables).toEqual({ id: '1', userId: '2' });
    expect(locationRegistry.match({ pathname: '/', search: 'name1=value1&name2=value2' }).queryParams).toEqual({ name1: 'value1', name2: 'value2' });
    expect(locationRegistry.match({ pathname: '/user/1' })).toBeNull();
  });

  it('should handle match properly after replacing routes', function () {
    var locationRegistry = new _locationRegistry2.default([]);

    expect(locationRegistry.match({ pathname: '/user/2/item/1' })).toBeNull();

    locationRegistry.replaceRoutes(routes);

    function getHandlers(pathname) {
      var _locationRegistry$mat2 = locationRegistry.match({ pathname: pathname }),
          pre = _locationRegistry$mat2.pre,
          match = _locationRegistry$mat2.match,
          post = _locationRegistry$mat2.post,
          error = _locationRegistry$mat2.error;

      return { pre: pre, match: match, post: post, error: error };
    }
    expect(getHandlers('/')).toEqual({ pre: _routes.route1.pre, match: _routes.route1.match, post: _routes.route1.post, error: _routes.route1.error });
    expect(locationRegistry.match({ pathname: '/user/2/item/1' }).pathVariables).toEqual({ id: '1', userId: '2' });
    expect(locationRegistry.match({ pathname: '/', search: 'name1=value1&name2=value2' }).queryParams).toEqual({ name1: 'value1', name2: 'value2' });
    expect(locationRegistry.match({ pathname: '/user/1' })).toBeNull();
  });
});