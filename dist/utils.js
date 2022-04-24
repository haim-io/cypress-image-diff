"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameAndCopyFile = exports.renameAndMoveFile = exports.setFilePermission = exports.adjustCanvas = exports.parseImage = exports.readDir = exports.cleanDir = exports.createDir = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _pngjs = require("pngjs");

var createDir = function createDir(dirs) {
  dirs.forEach(function (dir) {
    if (!_fsExtra["default"].existsSync(dir)) {
      _fsExtra["default"].mkdirSync(dir, {
        recursive: true
      });
    }
  });
};

exports.createDir = createDir;

var cleanDir = function cleanDir(dirs) {
  dirs.forEach(function (dir) {
    if (_fsExtra["default"].existsSync(dir)) {
      _fsExtra["default"].emptyDirSync(dir);
    }
  });
};

exports.cleanDir = cleanDir;

var readDir = function readDir(dir) {
  return _fsExtra["default"].readdirSync(dir);
};

exports.readDir = readDir;

var setFilePermission = function setFilePermission(dir, permission) {
  try {
    if (_fsExtra["default"].existsSync(dir)) {
      var fd = _fsExtra["default"].openSync(dir, 'r');

      _fsExtra["default"].fchmodSync(fd, permission);

      _fsExtra["default"].closeSync(fd);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

exports.setFilePermission = setFilePermission;

var renameAndMoveFile = function renameAndMoveFile(originalFilePath, newFilePath) {
  _fsExtra["default"].moveSync(originalFilePath, newFilePath, {
    overwrite: true
  });
};

exports.renameAndMoveFile = renameAndMoveFile;

var renameAndCopyFile = function renameAndCopyFile(originalFilePath, newFilePath) {
  _fsExtra["default"].copySync(originalFilePath, newFilePath, {
    overwrite: true
  });
};

exports.renameAndCopyFile = renameAndCopyFile;

var parseImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(image) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var fd = _fsExtra["default"].createReadStream(image);

              fd.pipe(new _pngjs.PNG()) // eslint-disable-next-line func-names
              .on('parsed', function () {
                var that = this;
                resolve(that);
              }).on('error', function (error) {
                return reject(error);
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function parseImage(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.parseImage = parseImage;

var adjustCanvas = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(image, width, height) {
    var imageAdjustedCanvas;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(image.width === width && image.height === height)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", image);

          case 2:
            imageAdjustedCanvas = new _pngjs.PNG({
              width: width,
              height: height,
              bitDepth: image.bitDepth,
              inputHasAlpha: true
            });

            _pngjs.PNG.bitblt(image, imageAdjustedCanvas, 0, 0, image.width, image.height, 0, 0);

            return _context2.abrupt("return", imageAdjustedCanvas);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function adjustCanvas(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.adjustCanvas = adjustCanvas;