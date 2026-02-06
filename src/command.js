import merge from 'lodash/merge'
import { recurse } from 'cypress-recurse';
import DEFAULT_CONFIG from './config.default'
import { getFileName } from './utils.browser'

const compareSnapshotCommand = () => {
  const userConfig = Cypress.expose('cypressImageDiff') || DEFAULT_CONFIG

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
      orignalOptions,
    ) => {
      const {
        name,
        testThreshold = userConfig.FAILURE_THRESHOLD,
        retryOptions = userConfig.RETRY_OPTIONS,
        exactName = false,
        cypressScreenshotOptions,
        nameTemplate = userConfig.NAME_TEMPLATE
      } = typeof orignalOptions === 'string' ? { name: orignalOptions } : orignalOptions

      // IN-QUEUE-FOR-BREAKING-CHANGE: Ternary condition here is to avoid a breaking change with the new option nameTemplate, will be simplified once we remove the exactName option
      // eslint-disable-next-line no-nested-ternary
      const testName = nameTemplate
        ? getFileName({
            nameTemplate,
            givenName: name,
            specName: Cypress.spec.name,
            browserName: Cypress.browser.name,
            width: Cypress.config('viewportWidth'),
            height: Cypress.config('viewportHeight'),
          })
        : exactName
        ? name
        : `${Cypress.spec.name.replace('.js', '')}${
            /^\//.test(name) ? '' : '-'
          }${name}`

      const defaultRetryOptions = {
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

          const screenshotOptions = merge({}, userConfig.CYPRESS_SCREENSHOT_OPTIONS, cypressScreenshotOptions)
          const objToOperateOn = subject ? cy.get(subject) : cy
          const screenshotted = objToOperateOn.screenshot(testName, screenshotOptions)

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
            inlineAssets: userConfig.INLINE_ASSETS
          }

          return cy.task('compareSnapshotsPlugin', options)
        },
        (percentage) => percentage <= testThreshold,
        Object.assign({}, defaultRetryOptions, retryOptions)
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
