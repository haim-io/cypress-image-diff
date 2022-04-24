"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cli = cli;

var _arg = _interopRequireDefault(require("arg"));

var _safe = _interopRequireDefault(require("colors/safe"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _config = _interopRequireDefault(require("./config"));

var _utils = require("./utils");

var parseArgumentsIntoOptions = function parseArgumentsIntoOptions(rawArgs) {
  var args = (0, _arg["default"])({
    '--update': Boolean,
    '-u': '--update'
  }, {
    argv: rawArgs.slice(2)
  });
  return {
    updateBaseline: args['--update'] || false
  };
}; // eslint-disable-next-line import/prefer-default-export


function cli(args) {
  var options = parseArgumentsIntoOptions(args);

  if (options.updateBaseline) {
    // Only update image if it failed the comparison
    var filesToUpdate = (0, _utils.readDir)(_config["default"].dir.diff);

    if (filesToUpdate) {
      filesToUpdate.forEach(function (file) {
        _fsExtra["default"].copySync("".concat(_config["default"].dir.comparison, "/").concat(file), "".concat(_config["default"].dir.baseline, "/").concat(file));

        console.log(_safe["default"].green("Updated baseline image ".concat(file)));
      });
    } else {
      var output = 'No baselines to be updated. Make sure to run the visual tests before running update.';
      console.log(_safe["default"].yellow(output));
    }
  }
}