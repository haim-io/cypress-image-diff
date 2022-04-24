"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var TestStatus = /*#__PURE__*/function () {
  function TestStatus(status, name) {
    (0, _classCallCheck2["default"])(this, TestStatus);
    this.status = status;
    this.name = name;
  }

  (0, _createClass2["default"])(TestStatus, [{
    key: "testStatus",
    get: function get() {
      if (this.status) {
        return 'pass';
      }

      return 'fail';
    }
  }]);
  return TestStatus;
}();

var _default = TestStatus;
exports["default"] = _default;