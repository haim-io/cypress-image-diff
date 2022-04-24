"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = require(".");

var _testStatus = _interopRequireDefault(require("./test-status"));

describe('Reporter', function () {
  describe('create report', function () {
    it('should create html template', function () {
      var testResult1 = new _testStatus["default"](true, 'Visual Test 1');
      var testResult2 = new _testStatus["default"](false, 'Visual Test 2');
      var result = (0, _.generateTemplate)({
        tests: [testResult1, testResult2]
      });
      expect(result).toMatchSnapshot();
    });
  });
});