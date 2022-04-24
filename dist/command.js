"use strict";

var _cypressRecurse = require("cypress-recurse");

var compareSnapshotCommand = function compareSnapshotCommand(defaultScreenshotOptions) {
  var height = Cypress.config('viewportHeight') || 1440;
  var width = Cypress.config('viewportWidth') || 1980; // Force screenshot resolution to keep consistency of test runs across machines

  Cypress.config('viewportHeight', parseInt(height, 10));
  Cypress.config('viewportWidth', parseInt(width, 10));
  Cypress.Commands.add('compareSnapshot', {
    prevSubject: 'optional'
  }, function (subject, name) {
    var testThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var recurseOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var specName = Cypress.spec.name;
    var testName = "".concat(specName.replace('.js', ''), "-").concat(name);
    var defaultRecurseOptions = {
      limit: 1,
      log: function log(percentage) {
        var prefix = percentage <= testThreshold ? 'PASS' : 'FAIL';
        cy.log("".concat(prefix, ": Image difference percentage ").concat(percentage));
      },
      error: "Image difference greater than threshold: ".concat(testThreshold)
    };
    (0, _cypressRecurse.recurse)(function () {
      // Clear the comparison/diff screenshots/reports for this test
      cy.task('deleteScreenshot', {
        testName: testName
      });
      cy.task('deleteReport', {
        testName: testName
      }); // Take a screenshot and copy to baseline if it does not exist

      var objToOperateOn = subject ? cy.get(subject) : cy;
      objToOperateOn.screenshot(testName, defaultScreenshotOptions).task('copyScreenshot', {
        testName: testName
      }); // Compare screenshots

      var options = {
        testName: testName,
        testThreshold: testThreshold
      };
      return cy.task('compareSnapshotsPlugin', options);
    }, function (percentage) {
      return percentage <= testThreshold;
    }, Object.assign({}, defaultRecurseOptions, recurseOptions));
  });
  Cypress.Commands.add('hideElement', {
    prevSubject: 'optional'
  }, function (subject) {
    var hide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (hide) {
      cy.get(subject).invoke('attr', 'style', "display: none;");
    } else {
      cy.get(subject).invoke('attr', 'style', "display: '';");
    }

    return undefined;
  });
};

module.exports = compareSnapshotCommand;