const compareSnapshotCommand = defaultScreenshotOptions => {
  Cypress.Screenshot.defaults({
    screenshotOnRunFailure: false
  })

  Cypress.Commands.add(
    'compareSnapshot',
    { prevSubject: 'optional' },
    (subject, name, testThreshold = 0) => {
      let screenshotOptions = defaultScreenshotOptions
      const testName = `${Cypress.spec.name.replace('.js', '')} - ${name}`
      // take snapshot
      const objToOperateOn = subject ? cy.get(subject) : cy

      objToOperateOn
        .screenshot(testName, screenshotOptions)
        .task('copyScreenshot', {
          testName,
        })

      // run visual tests
      const options = {
        testName,
        testThreshold,
      }

      cy.task('compareSnapshotsPlugin', options).then((percentage) => {
        if (percentage > testThreshold) {
          throw new Error(`The image difference percentage ${percentage} exceeded the threshold: ${testThreshold}`)
        }
      })
    }
  )
}

module.exports = compareSnapshotCommand
