"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  NavigationContainer: true,
  NavigationNativeContainer: true,
  useBackButton: true,
  useLinking: true,
  useScrollToTop: true,
  DefaultTheme: true,
  DarkTheme: true,
  ThemeProvider: true,
  useTheme: true
};
Object.defineProperty(exports, "NavigationContainer", {
  enumerable: true,
  get: function get() {
    return _NavigationContainer.default;
  }
});
Object.defineProperty(exports, "NavigationNativeContainer", {
  enumerable: true,
  get: function get() {
    return _NavigationNativeContainer.default;
  }
});
Object.defineProperty(exports, "useBackButton", {
  enumerable: true,
  get: function get() {
    return _useBackButton.default;
  }
});
Object.defineProperty(exports, "useLinking", {
  enumerable: true,
  get: function get() {
    return _useLinking.default;
  }
});
Object.defineProperty(exports, "useScrollToTop", {
  enumerable: true,
  get: function get() {
    return _useScrollToTop.default;
  }
});
Object.defineProperty(exports, "DefaultTheme", {
  enumerable: true,
  get: function get() {
    return _DefaultTheme.default;
  }
});
Object.defineProperty(exports, "DarkTheme", {
  enumerable: true,
  get: function get() {
    return _DarkTheme.default;
  }
});
Object.defineProperty(exports, "ThemeProvider", {
  enumerable: true,
  get: function get() {
    return _ThemeProvider.default;
  }
});
Object.defineProperty(exports, "useTheme", {
  enumerable: true,
  get: function get() {
    return _useTheme.default;
  }
});

var _core = require("@react-navigation/core");

Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _core[key];
    }
  });
});

var _NavigationContainer = _interopRequireDefault(require("./NavigationContainer"));

var _NavigationNativeContainer = _interopRequireDefault(require("./NavigationNativeContainer"));

var _useBackButton = _interopRequireDefault(require("./useBackButton"));

var _useLinking = _interopRequireDefault(require("./useLinking"));

var _useScrollToTop = _interopRequireDefault(require("./useScrollToTop"));

var _DefaultTheme = _interopRequireDefault(require("./theming/DefaultTheme"));

var _DarkTheme = _interopRequireDefault(require("./theming/DarkTheme"));

var _ThemeProvider = _interopRequireDefault(require("./theming/ThemeProvider"));

var _useTheme = _interopRequireDefault(require("./theming/useTheme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map