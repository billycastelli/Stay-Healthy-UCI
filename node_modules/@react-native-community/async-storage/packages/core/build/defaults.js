"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simpleErrorHandler = simpleErrorHandler;
exports.simpleLogger = simpleLogger;
exports.noop = noop;
exports.factoryOptions = void 0;

/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const isDevelopment = // @ts-ignore
process && process.env && process.env.NODE_ENV === 'development' || __DEV__;
const factoryOptions = {
  logger: isDevelopment,
  errorHandler: isDevelopment
};
exports.factoryOptions = factoryOptions;

function simpleErrorHandler(e) {
  let errorMessage = e instanceof Error ? e.message : e;
  console.error(errorMessage);
}

function simpleLogger(logInfo) {
  const log = message => {
    console.log(`[AsyncStorage] ${message}`);
  };

  const {
    action,
    key,
    value
  } = logInfo;

  switch (action) {
    case 'read-single':
      {
        log(`Reading a value for a key: ${key}`);
        break;
      }

    case 'save-single':
      {
        log(`Saving a value: ${value} for a key: ${key}`);
        break;
      }

    case 'delete-single':
      {
        log(`Removing value at a key: ${key}`);
        break;
      }

    case 'read-many':
      {
        log(`Reading values for keys: ${key}`);
        break;
      }

    case 'save-many':
      {
        log(`Saving values ${value} for keys: ${key}`);
        break;
      }

    case 'delete-many':
      {
        log(`Removing multiple values for keys: ${key}`);
        break;
      }

    case 'drop':
      {
        log('Dropping whole database');
        break;
      }

    case 'keys':
      {
        log('Retrieving keys');
        break;
      }

    default:
      {
        log(`Unknown action: ${action}`);
      }
  }
}

function noop() {// noop
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0cy50cyJdLCJuYW1lcyI6WyJpc0RldmVsb3BtZW50IiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiX19ERVZfXyIsImZhY3RvcnlPcHRpb25zIiwibG9nZ2VyIiwiZXJyb3JIYW5kbGVyIiwic2ltcGxlRXJyb3JIYW5kbGVyIiwiZSIsImVycm9yTWVzc2FnZSIsIkVycm9yIiwibWVzc2FnZSIsImNvbnNvbGUiLCJlcnJvciIsInNpbXBsZUxvZ2dlciIsImxvZ0luZm8iLCJsb2ciLCJhY3Rpb24iLCJrZXkiLCJ2YWx1ZSIsIm5vb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7OztBQVVBLE1BQU1BLGFBQWEsR0FDakI7QUFDQ0MsT0FBTyxJQUFJQSxPQUFPLENBQUNDLEdBQW5CLElBQTBCRCxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixhQUFwRCxJQUFzRUMsT0FGeEU7QUFJTyxNQUFNQyxjQUE4QixHQUFHO0FBQzVDQyxFQUFBQSxNQUFNLEVBQUVOLGFBRG9DO0FBRTVDTyxFQUFBQSxZQUFZLEVBQUVQO0FBRjhCLENBQXZDOzs7QUFLQSxTQUFTUSxrQkFBVCxDQUE0QkMsQ0FBNUIsRUFBK0M7QUFDcEQsTUFBSUMsWUFBWSxHQUFHRCxDQUFDLFlBQVlFLEtBQWIsR0FBcUJGLENBQUMsQ0FBQ0csT0FBdkIsR0FBaUNILENBQXBEO0FBQ0FJLEVBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjSixZQUFkO0FBQ0Q7O0FBRU0sU0FBU0ssWUFBVCxDQUFzQkMsT0FBdEIsRUFBNkM7QUFDbEQsUUFBTUMsR0FBRyxHQUFJTCxPQUFELElBQXFCO0FBQy9CQyxJQUFBQSxPQUFPLENBQUNJLEdBQVIsQ0FBYSxrQkFBaUJMLE9BQVEsRUFBdEM7QUFDRCxHQUZEOztBQUlBLFFBQU07QUFBQ00sSUFBQUEsTUFBRDtBQUFTQyxJQUFBQSxHQUFUO0FBQWNDLElBQUFBO0FBQWQsTUFBdUJKLE9BQTdCOztBQUVBLFVBQVFFLE1BQVI7QUFDRSxTQUFLLGFBQUw7QUFBb0I7QUFDbEJELFFBQUFBLEdBQUcsQ0FBRSw4QkFBNkJFLEdBQUksRUFBbkMsQ0FBSDtBQUNBO0FBQ0Q7O0FBQ0QsU0FBSyxhQUFMO0FBQW9CO0FBQ2xCRixRQUFBQSxHQUFHLENBQUUsbUJBQWtCRyxLQUFNLGVBQWNELEdBQUksRUFBNUMsQ0FBSDtBQUNBO0FBQ0Q7O0FBQ0QsU0FBSyxlQUFMO0FBQXNCO0FBQ3BCRixRQUFBQSxHQUFHLENBQUUsNEJBQTJCRSxHQUFJLEVBQWpDLENBQUg7QUFDQTtBQUNEOztBQUNELFNBQUssV0FBTDtBQUFrQjtBQUNoQkYsUUFBQUEsR0FBRyxDQUFFLDRCQUEyQkUsR0FBSSxFQUFqQyxDQUFIO0FBQ0E7QUFDRDs7QUFDRCxTQUFLLFdBQUw7QUFBa0I7QUFDaEJGLFFBQUFBLEdBQUcsQ0FBRSxpQkFBZ0JHLEtBQU0sY0FBYUQsR0FBSSxFQUF6QyxDQUFIO0FBQ0E7QUFDRDs7QUFDRCxTQUFLLGFBQUw7QUFBb0I7QUFDbEJGLFFBQUFBLEdBQUcsQ0FBRSxzQ0FBcUNFLEdBQUksRUFBM0MsQ0FBSDtBQUNBO0FBQ0Q7O0FBQ0QsU0FBSyxNQUFMO0FBQWE7QUFDWEYsUUFBQUEsR0FBRyxDQUFDLHlCQUFELENBQUg7QUFDQTtBQUNEOztBQUNELFNBQUssTUFBTDtBQUFhO0FBQ1hBLFFBQUFBLEdBQUcsQ0FBQyxpQkFBRCxDQUFIO0FBQ0E7QUFDRDs7QUFDRDtBQUFTO0FBQ1BBLFFBQUFBLEdBQUcsQ0FBRSxtQkFBa0JDLE1BQU8sRUFBM0IsQ0FBSDtBQUNEO0FBbkNIO0FBcUNEOztBQUVNLFNBQVNHLElBQVQsR0FBZ0IsQ0FDckI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IChjKSBSZWFjdCBOYXRpdmUgQ29tbXVuaXR5LlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG5pbXBvcnQge0ZhY3RvcnlPcHRpb25zLCBMb2dnZXJBY3Rpb259IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgaXNEZXZlbG9wbWVudCA9XG4gIC8vIEB0cy1pZ25vcmVcbiAgKHByb2Nlc3MgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHx8IF9fREVWX187XG5cbmV4cG9ydCBjb25zdCBmYWN0b3J5T3B0aW9uczogRmFjdG9yeU9wdGlvbnMgPSB7XG4gIGxvZ2dlcjogaXNEZXZlbG9wbWVudCxcbiAgZXJyb3JIYW5kbGVyOiBpc0RldmVsb3BtZW50LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNpbXBsZUVycm9ySGFuZGxlcihlOiBFcnJvciB8IHN0cmluZykge1xuICBsZXQgZXJyb3JNZXNzYWdlID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogZTtcbiAgY29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxlTG9nZ2VyKGxvZ0luZm86IExvZ2dlckFjdGlvbikge1xuICBjb25zdCBsb2cgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc29sZS5sb2coYFtBc3luY1N0b3JhZ2VdICR7bWVzc2FnZX1gKTtcbiAgfTtcblxuICBjb25zdCB7YWN0aW9uLCBrZXksIHZhbHVlfSA9IGxvZ0luZm87XG5cbiAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICBjYXNlICdyZWFkLXNpbmdsZSc6IHtcbiAgICAgIGxvZyhgUmVhZGluZyBhIHZhbHVlIGZvciBhIGtleTogJHtrZXl9YCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAnc2F2ZS1zaW5nbGUnOiB7XG4gICAgICBsb2coYFNhdmluZyBhIHZhbHVlOiAke3ZhbHVlfSBmb3IgYSBrZXk6ICR7a2V5fWApO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgJ2RlbGV0ZS1zaW5nbGUnOiB7XG4gICAgICBsb2coYFJlbW92aW5nIHZhbHVlIGF0IGEga2V5OiAke2tleX1gKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICdyZWFkLW1hbnknOiB7XG4gICAgICBsb2coYFJlYWRpbmcgdmFsdWVzIGZvciBrZXlzOiAke2tleX1gKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICdzYXZlLW1hbnknOiB7XG4gICAgICBsb2coYFNhdmluZyB2YWx1ZXMgJHt2YWx1ZX0gZm9yIGtleXM6ICR7a2V5fWApO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgJ2RlbGV0ZS1tYW55Jzoge1xuICAgICAgbG9nKGBSZW1vdmluZyBtdWx0aXBsZSB2YWx1ZXMgZm9yIGtleXM6ICR7a2V5fWApO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgJ2Ryb3AnOiB7XG4gICAgICBsb2coJ0Ryb3BwaW5nIHdob2xlIGRhdGFiYXNlJyk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAna2V5cyc6IHtcbiAgICAgIGxvZygnUmV0cmlldmluZyBrZXlzJyk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgbG9nKGBVbmtub3duIGFjdGlvbjogJHthY3Rpb259YCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkge1xuICAvLyBub29wXG59XG4iXX0=