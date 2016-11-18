import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import _find from 'lodash/find'

export default class LocationRegistry {

  _routes; // [{path, regex, variables, pre, match, post}]

  constructor(routes) {
    this._processConfig(routes);
  }

  replaceRoutes(routes) {
    this._processConfig(routes)
  }

  _processConfig = routes => {
    const _routes =  routes.map(route => {
      let { path, pattern, ...config } = route;

      let variables = [];
      let options = {};
      if (pattern && pattern.path) {
        path = pattern.path;
        options = pattern.options;
      } else if (path == null){
        throw new Error('Path must be defined in route or route.pattern!')
      }
      const regex = pathToRegexp(path, variables, options);

      return {
        regex,
        variables,
        ...config
      };
    });

    this._routes = _routes;
  }

  match = (location) => {
    const routes = this._routes;
    const { pathname, search } = location;

    let matchResult;
    const matchingRoute = _find(routes, r => {
      matchResult = r.regex.exec(pathname);
      return matchResult != null
    })

    if (!matchingRoute) {
      return null;
    } else {
      const { regex, variables, ...routeConfig } = matchingRoute;
      //parse pathVariables from path-to-regexp match result
      let pathVariables = {};
      variables.forEach((variable, i) => {
        pathVariables[variable.name] = matchResult[i + 1]
      })
      const queryParams = queryString.parse(search)

      const locationParams = { location, pathVariables, queryParams };

      return { locationParams, route: routeConfig };
    }
  }
}
