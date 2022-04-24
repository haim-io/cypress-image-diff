"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReport = exports.generateTemplate = void 0;

var _handlebars = _interopRequireDefault(require("handlebars"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("../config"));

var _arguments = typeof arguments === "undefined" ? void 0 : arguments,
    _this = void 0;

var handlebarsHelpers = function handlebarsHelpers() {
  _handlebars["default"].registerHelper('testStateIcon', function (status) {
    if (status === 'pass') {
      return '<span class="success">&#10004;</span>';
    }

    return '<span class="error">&#10006;</span>';
  });

  _handlebars["default"].registerHelper('equal', function (lvalue, rvalue, options) {
    // eslint-disable-next-line no-undef
    if (_arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");

    if (lvalue !== rvalue) {
      return options.inverse(_this);
    }

    return options.fn(_this);
  });
};

var generateTemplate = function generateTemplate(options) {
  handlebarsHelpers();

  var templateFile = _fs["default"].readFileSync(_path["default"].resolve(__dirname, '../reporter/template.hbs'), 'utf8');

  var template = _handlebars["default"].compile(templateFile);

  return template(options, {
    allowProtoPropertiesByDefault: {
      testStatus: true,
      name: true
    }
  });
};

exports.generateTemplate = generateTemplate;

var createReport = function createReport(options) {
  var template = generateTemplate(options);

  _fs["default"].writeFile(_config["default"].report(options.instance), template, function (err) {
    if (err) throw err;
  });
};

exports.createReport = createReport;