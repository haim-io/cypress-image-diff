"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safe = _interopRequireDefault(require("colors/safe"));

var _fsExtra = require("fs-extra");

var _cli = require("./cli");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

jest.mock('fs-extra', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('fs-extra')), {}, {
    copySync: jest.fn(),
    readdirSync: jest.fn()
  });
});
console.log = jest.fn();
describe('Cli', function () {
  afterEach(function () {
    jest.clearAllMocks();
  });
  describe('Update baseline images', function () {
    it('should not update baseline images if argument is not specified', function () {
      (0, _cli.cli)(['--dummyArg1', '--dummyArg2']);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(0);
    });
    it('should update baseline images if argument is specified', function () {
      var files = ['File1.png', 'File2.png'];

      _fsExtra.readdirSync.mockReturnValue(files);

      (0, _cli.cli)(['--dummyArg1', '--dummyArg2', '-u']);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(2);
      expect(console.log.mock.calls[0][0]).toBe(_safe["default"].green("Updated baseline image ".concat(files[0])));
      expect(console.log.mock.calls[1][0]).toBe(_safe["default"].green("Updated baseline image ".concat(files[1])));
    });
    it('should ignore the first 2 arguments', function () {
      (0, _cli.cli)(['-u', '-u']);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(0);
    });
    it('should output message when no images to be updated', function () {
      _fsExtra.readdirSync.mockReturnValue();

      (0, _cli.cli)(['--dummyArg1', '--dummyArg2', '-u']);
      var expectedOutput = 'No baselines to be updated. Make sure to run the visual tests before running update.';
      expect(console.log.mock.calls[0][0]).toBe(_safe["default"].yellow(expectedOutput));
    });
  });
});