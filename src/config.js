import path from 'path'

function getUserConfigFile() {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(path.join(process.cwd(), 'cypress-image-diff.config'))
  } catch (err) {
    return {}
  }
}

const DEFAULT_CONFIG = {
  ROOT_DIR: '',
  FAILURE_THRESHOLD: 0,
  RETRY_OPTIONS: {},
  FAIL_ON_MISSING_BASELINE: false,
  COMPARISON_OPTIONS: { threshold: 0.1 },
  GENERATE_HTML_REPORTER: false,
  CUSTOM_HTML_REPORTER: null
}

export const userConfig = { ...DEFAULT_CONFIG, ...getUserConfigFile() }

export class Paths {
  constructor() {
    this.rootDir = userConfig.ROOT_DIR
    this.screenshotFolderName = 'cypress-visual-screenshots'
    this.reportFolderName = 'cypress-visual-report'
  }

  get screenshotDir() {
    return path.join(this.rootDir, this.screenshotFolderName)
  }

  get baseline() {
    return path.join(process.cwd(), this.screenshotDir, 'baseline')
  }

  get comparison() {
    return path.join(process.cwd(), this.screenshotDir, 'comparison')
  }

  get diff() {
    return path.join(process.cwd(), this.screenshotDir, 'diff')
  }

  get image() {
    return {
      baseline: (testName) => {
        return path.join(this.baseline, `${testName}.png`)
      },
      comparison: (testName) => {
        return path.join(this.comparison, `${testName}.png`)
      },
      diff: (testName) => {
        return path.join(this.diff, `${testName}.png`)
      },
    }
  }

  get dir() {
    return {
      baseline: this.baseline,
      comparison: this.comparison,
      diff: this.diff,
    }
  }

  get reportDir() {
    return path.join(process.cwd(), this.rootDir, this.reportFolderName)
  }

  report(instance) {
    return path.join(this.reportDir, `cypress-visual-report${instance}.html`)
  }
}

export default new Paths()
