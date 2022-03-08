import { recurse } from 'cypress-recurse';

const compareSnapshotCommand = defaultScreenshotOptions => {
  const height = process.env.HEIGHT || 1440
  const width = process.env.WIDTH || 1980
  const failOnSnapshotDiff = Cypress.env('ignoreFailOnImageDiff') || false

  // Force screenshot resolution to keep consistency of test runs across machines
  Cypress.config('viewportHeight', parseInt(height, 10))
  Cypress.config('viewportWidth', parseInt(width, 10))

  Cypress.Commands.add(
    'compareSnapshot',
    { prevSubject: 'optional' },
    (subject, name, testThreshold = 0, recurseOptions = {}) => {
      const specName = Cypress.spec.name
      const testName = `${specName.replace('.js', '')}-${name}`

      const defaultRecurseOptions = {
        limit: 1,
        log: (percentage) => {
          const prefix = percentage <= testThreshold ? 'PASS' : 'FAIL'
          cy.log(`${prefix}: Image difference percentage ${percentage}`)
        },
        error: `Image difference greater than threshold: ${testThreshold}`
      }

      recurse(
        () => {
          // Clear the comparison/diff screenshots/reports for this test
          cy.task('deleteScreenshot', { testName })
          cy.task('deleteReport', { testName })

          // Take a screenshot and copy to baseline if it does not exist
          const objToOperateOn = subject ? cy.get(subject) : cy
          objToOperateOn
            .screenshot(testName, defaultScreenshotOptions)
            .task('copyScreenshot', {
              testName,
            })

          // Compare screenshots
          const options = {
            testName,
            testThreshold,
          }

          return cy.task('compareSnapshotsPlugin', options)
        },
        (percentage) => failOnSnapshotDiff ? true : percentage <= testThreshold,
        Object.assign({}, defaultRecurseOptions, recurseOptions)
      );
    }
  )

  Cypress.Commands.add('hideElement', { prevSubject: 'optional' }, (subject, hide=true) => {
    if (hide) {
      cy.get(subject).invoke('attr', 'style', `display: none;`)
    } else {
      cy.get(subject).invoke('attr', 'style', `display: '';`)
    }
    return undefined
  })
}

module.exports = compareSnapshotCommand
