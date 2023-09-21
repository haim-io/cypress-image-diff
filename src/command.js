import { recurse } from 'cypress-recurse';
import DEFAULT_CONFIG from './config.default'

const compareSnapshotCommand = defaultScreenshotOptions => {
  const userConfig = Cypress.env('cypressImageDiff') || DEFAULT_CONFIG

  const height = Cypress.config('viewportHeight') || 1440
  const width = Cypress.config('viewportWidth') || 1980

  // Force screenshot resolution to keep consistency of test runs across machines
  Cypress.config('viewportHeight', parseInt(height, 10))
  Cypress.config('viewportWidth', parseInt(width, 10))

  Cypress.Commands.add(
    'compareSnapshot',
    { prevSubject: 'optional' },
    (
      subject, 
      name, 
      testThreshold = userConfig.FAILURE_THRESHOLD,
      recurseOptions = userConfig.RETRY_OPTIONS
    ) => {
      const specName = Cypress.spec.name
      const testName = `${specName.replace('.js', '').replace('.ts', '')}${/^\//.test(name) ? '' : '-'}${name}`

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

          const objToOperateOn = subject ? cy.get(subject) : cy
          const screenshotted = objToOperateOn.screenshot(testName, defaultScreenshotOptions)

          if (userConfig.FAIL_ON_MISSING_BASELINE === false) {
            // copy to baseline if it does not exist
            screenshotted.task('copyScreenshot', {
              testName,
            })
          }

          // Compare screenshots
          const options = {
            testName,
            testThreshold,
            failOnMissingBaseline: userConfig.FAIL_ON_MISSING_BASELINE,
            specFilename: Cypress.spec.name,
            specPath: Cypress.spec.relative,
          }
          
          return cy.task('compareSnapshotsPlugin', options)
        },
        (percentage) => percentage <= testThreshold,
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
