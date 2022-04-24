"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fsExtra = require("fs-extra");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

jest.mock('fs-extra', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('fs-extra')), {}, {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    emptyDirSync: jest.fn(),
    readdirSync: jest.fn(),
    moveSync: jest.fn()
  });
});
describe('Utils', function () {
  var args = ['some/path'];
  var sampleFiles = ['test.png', 'test1.png'];
  afterEach(function () {
    jest.clearAllMocks();
  });
  describe('Create dir', function () {
    it('should trigger create directory function when path doesn\'t exist', function () {
      _fsExtra.existsSync.mockReturnValue(false);

      (0, _utils.createDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.mkdirSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.mkdirSync).toBeCalledWith(args[0], {
        "recursive": true
      });
    });
    it('should not trigger create directory function when path exists', function () {
      _fsExtra.existsSync.mockReturnValue(true);

      (0, _utils.createDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.mkdirSync).toHaveBeenCalledTimes(0);
    });
  });
  describe('Clean dir', function () {
    it('should trigger clean directory function when path exists', function () {
      _fsExtra.existsSync.mockReturnValue(true);

      _fsExtra.readdirSync.mockReturnValue(sampleFiles);

      (0, _utils.cleanDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.emptyDirSync).toHaveBeenCalledTimes(1);
    });
    it('should not trigger clean directory function when path doesn\'t exist', function () {
      _fsExtra.existsSync.mockReturnValue(false);

      (0, _utils.cleanDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.emptyDirSync).toHaveBeenCalledTimes(0);
    });
  });
  describe('Move files', function () {
    it('should move files', function () {
      (0, _utils.renameAndMoveFile)(sampleFiles[0], sampleFiles[1]);
      expect(_fsExtra.moveSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.moveSync).toBeCalledWith(sampleFiles[0], sampleFiles[1], {
        "overwrite": true
      });
    });
  });
});