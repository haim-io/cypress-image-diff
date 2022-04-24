"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _pixelmatch = _interopRequireDefault(require("pixelmatch"));

var _pngjs = require("pngjs");

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

var _testStatus = _interopRequireDefault(require("./reporter/test-status"));

var _reporter = require("./reporter");

var testStatuses = [];

var setupFolders = function setupFolders() {
  (0, _utils.createDir)([_config["default"].dir.baseline, _config["default"].dir.comparison, _config["default"].dir.diff, _config["default"].reportDir]);
};

var tearDownDirs = function tearDownDirs() {
  (0, _utils.cleanDir)([_config["default"].dir.comparison, _config["default"].dir.diff, _config["default"].reportDir]);
};

var generateReport = function generateReport() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (testStatuses.length > 0) {
    (0, _reporter.createReport)({
      tests: testStatuses,
      instance: instance
    });
  }

  return true;
};

var deleteReport = function deleteReport(args) {
  testStatuses = testStatuses.filter(function (testStatus) {
    return testStatus.name !== args.testName;
  });
  return true;
};

var copyScreenshot = function copyScreenshot(args) {
  // If baseline does not exist, copy comparison image to baseline folder
  if (!_fsExtra["default"].existsSync(_config["default"].image.baseline(args.testName))) {
    _fsExtra["default"].copySync(_config["default"].image.comparison(args.testName), _config["default"].image.baseline(args.testName));
  }

  return true;
}; // Delete screenshot from comparison and diff directories


var deleteScreenshot = function deleteScreenshot(args) {
  if (_fsExtra["default"].existsSync(_config["default"].image.comparison(args.testName))) {
    _fsExtra["default"].unlinkSync(_config["default"].image.comparison(args.testName));
  }

  if (_fsExtra["default"].existsSync(_config["default"].image.diff(args.testName))) {
    _fsExtra["default"].unlinkSync(_config["default"].image.diff(args.testName));
  }

  return true;
};

function compareSnapshotsPlugin(_x) {
  return _compareSnapshotsPlugin.apply(this, arguments);
}

function _compareSnapshotsPlugin() {
  _compareSnapshotsPlugin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(args) {
    var baselineImg, comparisonImg, diff, baselineFullCanvas, comparisonFullCanvas, pixelMismatchResult, percentage, testFailed;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.parseImage)(_config["default"].image.baseline(args.testName));

          case 2:
            baselineImg = _context.sent;
            _context.next = 5;
            return (0, _utils.parseImage)(_config["default"].image.comparison(args.testName));

          case 5:
            comparisonImg = _context.sent;
            diff = new _pngjs.PNG({
              width: Math.max(comparisonImg.width, baselineImg.width),
              height: Math.max(comparisonImg.height, baselineImg.height)
            });
            _context.next = 9;
            return (0, _utils.adjustCanvas)(baselineImg, diff.width, diff.height);

          case 9:
            baselineFullCanvas = _context.sent;
            _context.next = 12;
            return (0, _utils.adjustCanvas)(comparisonImg, diff.width, diff.height);

          case 12:
            comparisonFullCanvas = _context.sent;
            pixelMismatchResult = (0, _pixelmatch["default"])(baselineFullCanvas.data, comparisonFullCanvas.data, diff.data, diff.width, diff.height, {
              threshold: 0.1
            });
            percentage = Math.pow(pixelMismatchResult / diff.width / diff.height, 0.5);
            testFailed = percentage > args.testThreshold;

            if (testFailed) {
              _fsExtra["default"].ensureFileSync(_config["default"].image.diff(args.testName));

              diff.pack().pipe(_fsExtra["default"].createWriteStream(_config["default"].image.diff(args.testName)));
            } // Saving test status object to build report if task is triggered


            testStatuses.push(new _testStatus["default"](!testFailed, args.testName));
            return _context.abrupt("return", percentage);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _compareSnapshotsPlugin.apply(this, arguments);
}

var getCompareSnapshotsPlugin = function getCompareSnapshotsPlugin(on, config) {
  // Create folder structure
  setupFolders(); // Delete comparison, diff images and generated reports to ensure a clean run

  tearDownDirs(); // Force screenshot resolution to keep consistency of test runs across machines

  on('before:browser:launch', function (browser, launchOptions) {
    var width = config.viewportWidth || '1280';
    var height = config.viewportHeight || '720';

    if (browser.name === 'chrome') {
      launchOptions.args.push("--window-size=".concat(width, ",").concat(height));
      launchOptions.args.push('--force-device-scale-factor=1');
    }

    if (browser.name === 'electron') {
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.width = Number.parseInt(width, 10); // eslint-disable-next-line no-param-reassign

      launchOptions.preferences.height = Number.parseInt(height, 10);
    }

    if (browser.name === 'firefox') {
      launchOptions.args.push("--width=".concat(width));
      launchOptions.args.push("--height=".concat(height));
    }

    return launchOptions;
  }); // Intercept cypress screenshot and create a new image with our own
  // name convention and file structure for simplicity and consistency

  on('after:screenshot', function (details) {
    // Change screenshots file permission so it can be moved from drive to drive
    (0, _utils.setFilePermission)(details.path, 511);
    (0, _utils.setFilePermission)(_config["default"].image.comparison(details.name), 511);
    (0, _utils.renameAndCopyFile)(details.path, _config["default"].image.comparison(details.name));
  });
  on('task', {
    compareSnapshotsPlugin: compareSnapshotsPlugin,
    copyScreenshot: copyScreenshot,
    deleteScreenshot: deleteScreenshot,
    generateReport: generateReport,
    deleteReport: deleteReport
  });
};

module.exports = getCompareSnapshotsPlugin;