import * as React from 'react';
import { getStateFromPath as getStateFromPathDefault, getPathFromState as getPathFromStateDefault, getActionFromState } from '@react-navigation/core';

const getStateLength = state => {
  let length = 0;

  if (state.history) {
    length = state.history.length;
  } else {
    length = state.index + 1;
  }

  const focusedState = state.routes[state.index].state;

  if (focusedState && !focusedState.stale) {
    // If the focused route has history entries, we need to count them as well
    length += getStateLength(focusedState) - 1;
  }

  return length;
};

let isUsingLinking = false;
export default function useLinking(ref, _ref) {
  let {
    config,
    getStateFromPath = getStateFromPathDefault,
    getPathFromState = getPathFromStateDefault
  } = _ref;
  React.useEffect(() => {
    if (isUsingLinking) {
      throw new Error("Looks like you are using 'useLinking' in multiple components. This is likely an error since URL integration should only be handled in one place to avoid conflicts.");
    } else {
      isUsingLinking = true;
    }

    return () => {
      isUsingLinking = false;
    };
  }); // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect

  const configRef = React.useRef(config);
  const getStateFromPathRef = React.useRef(getStateFromPath);
  const getPathFromStateRef = React.useRef(getPathFromState);
  React.useEffect(() => {
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
    getPathFromStateRef.current = getPathFromState;
  }, [config, getPathFromState, getStateFromPath]); // Make it an async function to keep consistent with the native impl

  const getInitialState = React.useCallback(async () => {
    const path = location.pathname + location.search;

    if (path) {
      return getStateFromPathRef.current(path, configRef.current);
    } else {
      return undefined;
    }
  }, []);
  const previousStateLengthRef = React.useRef(undefined);
  const previousHistoryIndexRef = React.useRef(0);
  const pendingIndexChangeRef = React.useRef();
  const pendingStateUpdateRef = React.useRef(false);
  const pendingStateMultiUpdateRef = React.useRef(false); // If we're navigating ahead >1, we're not restoring whole state,
  // but just navigate to the selected route not caring about previous routes
  // therefore if we need to go back, we need to pop screen and navigate to the new one
  // Possibly, we will need to reuse the same mechanism.
  // E.g. if we went ahead+4 (numberOfIndicesAhead = 3), and back-2,
  // actually we need to pop the screen we navigated
  // and navigate again, setting numberOfIndicesAhead to 1.

  const numberOfIndicesAhead = React.useRef(0);
  React.useEffect(() => {
    window.addEventListener('popstate', () => {
      var _ref2, _history$state;

      const navigation = ref.current;

      if (!navigation) {
        return;
      }

      const previousHistoryIndex = previousHistoryIndexRef.current;
      const historyIndex = (_ref2 = (_history$state = history.state) === null || _history$state === void 0 ? void 0 : _history$state.index) !== null && _ref2 !== void 0 ? _ref2 : 0;
      previousHistoryIndexRef.current = historyIndex;

      if (pendingIndexChangeRef.current === historyIndex) {
        pendingIndexChangeRef.current = undefined;
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      let canGoBack = true;
      let numberOfBacks = 0;

      if (previousHistoryIndex === historyIndex) {
        if (location.pathname + location.search !== path) {
          pendingStateUpdateRef.current = true;
          history.replaceState({
            index: historyIndex
          }, '', path);
        }
      } else if (previousHistoryIndex > historyIndex) {
        numberOfBacks = previousHistoryIndex - historyIndex - numberOfIndicesAhead.current;

        if (numberOfBacks > 0) {
          pendingStateMultiUpdateRef.current = true;

          if (numberOfBacks > 1) {
            pendingStateMultiUpdateRef.current = true;
          }

          pendingStateUpdateRef.current = true;

          for (let i = 0; i < numberOfBacks; i++) {
            navigation.goBack();
          }
        } else {
          canGoBack = false;
        }
      }

      if (previousHistoryIndex < historyIndex || !canGoBack) {
        if (canGoBack) {
          numberOfIndicesAhead.current = historyIndex - previousHistoryIndex - 1;
        } else {
          navigation.goBack();
          numberOfIndicesAhead.current -= previousHistoryIndex - historyIndex;
        }

        const state = getStateFromPathRef.current(location.pathname + location.search, configRef.current);
        pendingStateMultiUpdateRef.current = true;

        if (state) {
          const action = getActionFromState(state);
          pendingStateUpdateRef.current = true;

          if (action !== undefined) {
            navigation.dispatch(action);
          } else {
            navigation.resetRoot(state);
          }
        }
      }
    });
  }, [ref]);
  React.useEffect(() => {
    var _ref$current;

    if (ref.current && previousStateLengthRef.current === undefined) {
      previousStateLengthRef.current = getStateLength(ref.current.getRootState());
    }

    if (ref.current && location.pathname + location.search === '/') {
      var _ref3, _history$state2;

      history.replaceState({
        index: (_ref3 = (_history$state2 = history.state) === null || _history$state2 === void 0 ? void 0 : _history$state2.index) !== null && _ref3 !== void 0 ? _ref3 : 0
      }, '', getPathFromStateRef.current(ref.current.getRootState(), configRef.current));
    }

    const unsubscribe = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.addListener('state', () => {
      var _previousStateLengthR, _ref4, _history$state3;

      const navigation = ref.current;

      if (!navigation) {
        return;
      }

      const state = navigation.getRootState();
      const path = getPathFromStateRef.current(state, configRef.current);
      const previousStateLength = (_previousStateLengthR = previousStateLengthRef.current) !== null && _previousStateLengthR !== void 0 ? _previousStateLengthR : 1;
      const stateLength = getStateLength(state);

      if (pendingStateMultiUpdateRef.current) {
        if (location.pathname + location.search === path) {
          pendingStateMultiUpdateRef.current = false;
        } else {
          return;
        }
      }

      previousStateLengthRef.current = stateLength;

      if (pendingStateUpdateRef.current && location.pathname + location.search === path) {
        pendingStateUpdateRef.current = false;
        return;
      }

      let index = (_ref4 = (_history$state3 = history.state) === null || _history$state3 === void 0 ? void 0 : _history$state3.index) !== null && _ref4 !== void 0 ? _ref4 : 0;

      if (previousStateLength === stateLength) {
        // If no new enrties were added to history in our navigation state, we want to replaceState
        if (location.pathname + location.search !== path) {
          history.replaceState({
            index
          }, '', path);
          previousHistoryIndexRef.current = index;
        }
      } else if (stateLength > previousStateLength) {
        // If new enrties were added, pushState until we have same length
        // This won't be accurate if multiple enrties were added at once, but that's the best we can do
        for (let i = 0, l = stateLength - previousStateLength; i < l; i++) {
          index++;
          history.pushState({
            index
          }, '', path);
        }

        previousHistoryIndexRef.current = index;
      } else if (previousStateLength > stateLength) {
        const delta = previousStateLength - stateLength; // We need to set this to ignore the `popstate` event

        pendingIndexChangeRef.current = index - delta; // If new enrties were removed, go back so that we have same length

        history.go(-delta);
      }
    });
    return unsubscribe;
  });
  return {
    getInitialState
  };
}
//# sourceMappingURL=useLinking.js.map