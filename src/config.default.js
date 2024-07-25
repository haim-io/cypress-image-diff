export default {
  ROOT_DIR: '',
  REPORT_DIR: 'cypress-image-diff-html-report',
  SCREENSHOTS_DIR: 'cypress-image-diff-screenshots',
  FAILURE_THRESHOLD: 0,
  RETRY_OPTIONS: {},
  FAIL_ON_MISSING_BASELINE: false,
  COMPARISON_OPTIONS: { threshold: 0.1 },
  JSON_REPORT: {
    FILENAME: '',
    OVERWRITE: true,
  },
  CYPRESS_SCREENSHOT_OPTIONS: {},
  INLINE_ASSETS: false,
  // IN-QUEUE-FOR-BREAKING-CHANGE: default NAME_TEMPLATE can be set until the next breaking change
  // NAME_TEMPLATE: '[specName]-[givenName]'
}