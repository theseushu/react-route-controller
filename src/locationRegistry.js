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
      let { path, pattern, pre, match, post, error } = route;
      let result = { pre, match, post, error };

      let variables = [];
      let options = {};
      if (pattern && pattern.path) {
        result.path = pattern.path;
        options = pattern.options;
      } else if (path) {
        result.path = path;
      } else {
        throw new Error('Path must be defined in route or route.pattern!')
      }
      const regex = pathToRegexp(result.path, variables, options);

      result.regex = regex;
      result.variables = variables;

      return result;
    });

    this._routes = _routes;
  }

  match = (location) => {
    const routes = this._routes;
    const { pathname, search } = location;

    let matchResult;
    const route = _find(routes, (route) => {
      matchResult = route.regex.exec(pathname);
      return matchResult != null
    })

    if (route == null) {
      return null;
    } else {
      const { variables, pre, match, post, error } = route;
      //parse pathVariables from path-to-regexp match result
      let pathVariables = {};
      variables.forEach((variable, i) => {
        pathVariables[variable.name] = matchResult[i + 1]
      })
      const queryParams = queryString.parse(search)

      return { pathVariables, queryParams, pre, match, post, error };
    }
  }
}
