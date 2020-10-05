const compareSnapshotCommand = defaultScreenshotOptions => {
  Cypress.Commands.add(
    'compareSnapshot',
    { prevSubject: 'optional' },
    (subject, name) => {
      let screenshotOptions = defaultScreenshotOptions

      // take snapshot
      const objToOperateOn = subject ? cy.get(subject) : cy

      objToOperateOn
        .screenshot(name, screenshotOptions)
        .task('copyScreenshot', {
          testName: name,
        })

      // run visual tests
      const options = {
        testName: name,
      }

      cy.task('compareSnapshotsPlugin', options).then((result) => {
        if (result > 0) {
          throw new Error(
            `The image has ${result} pixel differences.`
          )
        }
      })
    }
  )
}

module.exports = compareSnapshotCommand
