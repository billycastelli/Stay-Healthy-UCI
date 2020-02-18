function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import escape from 'escape-string-regexp';
import queryString from 'query-string';

/**
 * Utility to parse a path string to initial state object accepted by the container.
 * This is useful for deep linking when we need to handle the incoming URL.
 *
 * Example:
 * ```js
 * getStateFromPath(
 *   '/chat/jane/42',
 *   {
 *     Chat: {
 *       path: 'chat/:author/:id',
 *       parse: { id: Number }
 *     }
 *   }
 * )
 * ```
 * @param path Path string to parse and convert, e.g. /foo/bar?count=42.
 * @param options Extra options to fine-tune how to parse the path.
 */
export default function getStateFromPath(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (path === '') {
    return undefined;
  }

  let initialRoutes = []; // Create a normalized configs array which will be easier to use

  const configs = [].concat(...Object.keys(options).map(key => createNormalizedConfigs(key, options, [], initialRoutes)));
  let result;
  let current;
  let remaining = path.replace(/[/]+/, '/') // Replace multiple slash (//) with single ones
  .replace(/^\//, '') // Remove extra leading slash
  .replace(/\?.*/, ''); // Remove query params which we will handle later

  while (remaining) {
    let routeNames;
    let params; // Go through all configs, and see if the next path segment matches our regex

    for (const config of configs) {
      const match = remaining.match(config.match); // If our regex matches, we need to extract params from the path

      if (match) {
        routeNames = [...config.routeNames];
        const paramPatterns = config.pattern.split('/').filter(p => p.startsWith(':'));

        if (paramPatterns.length) {
          params = paramPatterns.reduce((acc, p, i) => {
            const key = p.replace(/^:/, '');
            const value = match[i + 1]; // The param segments start from index 1 in the regex match result

            acc[key] = config.parse && config.parse[key] ? config.parse[key](value) : value;
            return acc;
          }, {});
        } // Remove the matched segment from the remaining path


        remaining = remaining.replace(match[0], '');
        break;
      }
    } // If we hadn't matched any segments earlier, use the path as route name


    if (routeNames === undefined) {
      const segments = remaining.split('/');
      routeNames = [decodeURIComponent(segments[0])];
      segments.shift();
      remaining = segments.join('/');
    }

    let state;
    let routeName = routeNames.shift();
    let initialRoute = findInitialRoute(routeName, initialRoutes);
    state = createNestedState(initialRoute, routeName, routeNames.length === 0, params);

    if (routeNames.length > 0) {
      let nestedState = state;

      while (routeName = routeNames.shift()) {
        initialRoute = findInitialRoute(routeName, initialRoutes);
        nestedState.routes[nestedState.index || 0].state = createNestedState(initialRoute, routeName, routeNames.length === 0, params);

        if (routeNames.length > 0) {
          nestedState = nestedState.routes[nestedState.index || 0].state;
        }
      }
    }

    if (current) {
      var _current2;

      // The state should be nested inside the deepest route we parsed before
      while ((_current = current) === null || _current === void 0 ? void 0 : _current.routes[current.index || 0].state) {
        var _current;

        current = current.routes[current.index || 0].state;
      }

      current.routes[((_current2 = current) === null || _current2 === void 0 ? void 0 : _current2.index) || 0].state = state;
    } else {
      result = state;
    }

    current = state;
  }

  if (current == null || result == null) {
    return undefined;
  }

  const query = path.split('?')[1];

  if (query) {
    var _current4;

    while ((_current3 = current) === null || _current3 === void 0 ? void 0 : _current3.routes[current.index || 0].state) {
      var _current3;

      // The query params apply to the deepest route
      current = current.routes[current.index || 0].state;
    }

    const route = current.routes[((_current4 = current) === null || _current4 === void 0 ? void 0 : _current4.index) || 0];
    const params = queryString.parse(query);
    const parseFunction = findParseConfigForRoute(route.name, configs);

    if (parseFunction) {
      Object.keys(params).forEach(name => {
        if (parseFunction[name] && typeof params[name] === 'string') {
          params[name] = parseFunction[name](params[name]);
        }
      });
    }

    route.params = _objectSpread({}, route.params, {}, params);
  }

  return result;
}

function createNormalizedConfigs(key, routeConfig) {
  let routeNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let initials = arguments.length > 3 ? arguments[3] : undefined;
  const configs = [];
  routeNames.push(key);
  const value = routeConfig[key];

  if (typeof value === 'string') {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    if (value !== '') {
      configs.push(createConfigItem(routeNames, value));
    }
  } else if (typeof value === 'object') {
    // if an object is specified as the value (e.g. Foo: { ... }),
    // it can have `path` property and
    // it could have `screens` prop which has nested configs
    if (value.path && value.path !== '') {
      configs.push(createConfigItem(routeNames, value.path, value.parse));
    }

    if (value.screens) {
      // property `initialRouteName` without `screens` has no purpose
      if (value.initialRouteName) {
        initials.push({
          initialRouteName: value.initialRouteName,
          connectedRoutes: Object.keys(value.screens)
        });
      }

      Object.keys(value.screens).forEach(nestedConfig => {
        const result = createNormalizedConfigs(nestedConfig, value.screens, routeNames, initials);
        configs.push(...result);
      });
    }
  }

  routeNames.pop();
  return configs;
}

function createConfigItem(routeNames, pattern, parse) {
  const match = new RegExp('^' + escape(pattern).replace(/:[a-z0-9]+/gi, '([^/]+)') + '/?');
  return {
    match,
    pattern,
    // The routeNames array is mutated, so copy it to keep the current state
    routeNames: [...routeNames],
    parse
  };
}

function findParseConfigForRoute(routeName, flatConfig) {
  for (const config of flatConfig) {
    if (routeName === config.routeNames[config.routeNames.length - 1]) {
      return config.parse;
    }
  }

  return undefined;
} // tries to find an initial route connected with the one passed


function findInitialRoute(routeName, initialRoutes) {
  for (const config of initialRoutes) {
    if (config.connectedRoutes.includes(routeName)) {
      return config.initialRouteName === routeName ? undefined : config.initialRouteName;
    }
  }

  return undefined;
} // returns nested state object with values depending on whether
// it is the end of state and if there is initialRoute for this level


function createNestedState(initialRoute, routeName, isEmpty, params) {
  if (isEmpty) {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{
          name: initialRoute
        }, _objectSpread({
          name: routeName
        }, params && {
          params
        })]
      };
    } else {
      return {
        routes: [_objectSpread({
          name: routeName
        }, params && {
          params
        })]
      };
    }
  } else {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{
          name: initialRoute
        }, {
          name: routeName,
          state: {
            routes: []
          }
        }]
      };
    } else {
      return {
        routes: [{
          name: routeName,
          state: {
            routes: []
          }
        }]
      };
    }
  }
}
//# sourceMappingURL=getStateFromPath.js.map