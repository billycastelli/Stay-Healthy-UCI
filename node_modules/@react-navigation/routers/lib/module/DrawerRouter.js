function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import shortid from 'shortid';
import TabRouter, { TabActions } from './TabRouter';
export const DrawerActions = _objectSpread({}, TabActions, {
  openDrawer() {
    return {
      type: 'OPEN_DRAWER'
    };
  },

  closeDrawer() {
    return {
      type: 'CLOSE_DRAWER'
    };
  },

  toggleDrawer() {
    return {
      type: 'TOGGLE_DRAWER'
    };
  }

});

const isDrawerOpen = state => {
  var _state$history;

  return Boolean((_state$history = state.history) === null || _state$history === void 0 ? void 0 : _state$history.find(it => it.type === 'drawer'));
};

const openDrawer = state => {
  if (isDrawerOpen(state)) {
    return state;
  }

  return _objectSpread({}, state, {
    history: [...state.history, {
      type: 'drawer'
    }]
  });
};

const closeDrawer = state => {
  if (!isDrawerOpen(state)) {
    return state;
  }

  return _objectSpread({}, state, {
    history: state.history.filter(it => it.type !== 'drawer')
  });
};

export default function DrawerRouter(options) {
  const router = TabRouter(options);
  return _objectSpread({}, router, {
    type: 'drawer',

    getInitialState(_ref) {
      let {
        routeNames,
        routeParamList
      } = _ref;
      const state = router.getInitialState({
        routeNames,
        routeParamList
      });
      return _objectSpread({}, state, {
        stale: false,
        type: 'drawer',
        key: "drawer-".concat(shortid())
      });
    },

    getRehydratedState(partialState, _ref2) {
      let {
        routeNames,
        routeParamList
      } = _ref2;

      if (partialState.stale === false) {
        return partialState;
      }

      let state = router.getRehydratedState(partialState, {
        routeNames,
        routeParamList
      });

      if (isDrawerOpen(partialState)) {
        state = openDrawer(state);
      }

      return _objectSpread({}, state, {
        type: 'drawer',
        key: "drawer-".concat(shortid())
      });
    },

    getStateForRouteFocus(state, key) {
      const result = router.getStateForRouteFocus(state, key);
      return closeDrawer(result);
    },

    getStateForAction(state, action, options) {
      switch (action.type) {
        case 'OPEN_DRAWER':
          return openDrawer(state);

        case 'CLOSE_DRAWER':
          return closeDrawer(state);

        case 'TOGGLE_DRAWER':
          if (isDrawerOpen(state)) {
            return closeDrawer(state);
          }

          return openDrawer(state);

        case 'GO_BACK':
          if (isDrawerOpen(state)) {
            return closeDrawer(state);
          }

          return router.getStateForAction(state, action, options);

        default:
          return router.getStateForAction(state, action, options);
      }
    },

    actionCreators: DrawerActions
  });
}
//# sourceMappingURL=DrawerRouter.js.map