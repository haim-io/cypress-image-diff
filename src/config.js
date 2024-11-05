import path from 'path'
import merge from 'lodash/merge'
import fs from 'fs-extra'
import DEFAULT_CONFIG from './config.default'

export function getUserConfigFile() {
  try {
    if (fs.existsSync(path.join(process.cwd(), 'cypress-image-diff.config.cjs'))) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(path.join(process.cwd(), 'cypress-image-diff.config.cjs'))
    }
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(path.join(process.cwd(), 'cypress-image-diff.config'))
  } catch (err) {
    return {}
  }
}

export const getUserConfig = () => merge({}, DEFAULT_CONFIG, getUserConfigFile());
export class Paths {
  constructor(config) {
    this.rootDir = config.ROOT_DIR
    this.screenshotFolderName = config.SCREENSHOTS_DIR
    this.reportFolderName = config.REPORT_DIR
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
    return path.join(this.reportDir, `${this.reportFolderName}${instance}.html`)
  }
}

export default new Paths(getUserConfig())
