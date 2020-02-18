"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFocusEffect;

var React = _interopRequireWildcard(require("react"));

var _useNavigation = _interopRequireDefault(require("./useNavigation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Hook to run an effect in a focused screen, similar to `React.useEffect`.
 * This can be used to perform side-effects such as fetching data or subscribing to events.
 * The passed callback should be wrapped in `React.useCallback` to avoid running the effect too often.
 *
 * @param callback Memoized callback containing the effect, should optionally return a cleanup function.
 */
function useFocusEffect(callback) {
  const navigation = (0, _useNavigation.default)();
  React.useEffect(() => {
    let isFocused = false;
    let cleanup; // We need to run the effect on intial render/dep changes if the screen is focused

    if (navigation.isFocused()) {
      cleanup = callback();
      isFocused = true;
    }

    const unsubscribeFocus = navigation.addListener('focus', () => {
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on intial render, so we guard against runing the effect twice
      if (isFocused) {
        return;
      }

      if (cleanup !== undefined) {
        cleanup();
      }

      cleanup = callback();
      isFocused = true;
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (cleanup !== undefined) {
        cleanup();
      }

      cleanup = undefined;
      isFocused = false;
    });
    return () => {
      if (cleanup !== undefined) {
        cleanup();
      }

      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [callback, navigation]);
}
//# sourceMappingURL=useFocusEffect.js.map