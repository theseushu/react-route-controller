import LocationRegistry from '../locationRegistry';

import { route1, route2, route3 } from './routes';

const routes = [
  route1, route2, route3
]

describe('LocationRegistry tests', () => {
  it('should throw error if route is not proper', () => {
    const locationRegistry = new LocationRegistry(routes);

    expect(() => new LocationRegistry([route1, {}])).toThrowError('Path must be defined in route or route.pattern!')
  });

  it('should handle match properly', () => {
    const locationRegistry = new LocationRegistry(routes);

    expect(locationRegistry.match({pathname: '/'}).route).toEqual({match: route1.match, error: route1.error})
    expect(locationRegistry.match({pathname: '/user/2/item/1'}).locationParams.pathVariables).toEqual({id: '1', userId: '2'})
    expect(locationRegistry.match({pathname: '/', search: 'name1=value1&name2=value2'}).locationParams.queryParams).toEqual({name1: 'value1', name2: 'value2'})
    expect(locationRegistry.match({pathname: '/user/1'})).toBeNull();
  });

  it('should handle match properly after replacing routes', () => {
    const locationRegistry = new LocationRegistry([]);

    expect(locationRegistry.match({pathname: '/user/2/item/1'})).toBeNull();

    locationRegistry.replaceRoutes(routes)

    function getHandlers(pathname) {
      let {pre, match, post, error} = locationRegistry.match({pathname});
      return {pre, match, post, error}
    }
    expect(locationRegistry.match({pathname: '/'}).route).toEqual({match: route1.match, error: route1.error})
    expect(locationRegistry.match({pathname: '/user/2/item/1'}).locationParams.pathVariables).toEqual({id: '1', userId: '2'})
    expect(locationRegistry.match({pathname: '/', search: 'name1=value1&name2=value2'}).locationParams.queryParams).toEqual({name1: 'value1', name2: 'value2'})
    expect(locationRegistry.match({pathname: '/user/1'})).toBeNull();
  });
})
