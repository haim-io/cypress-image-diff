import path from 'path'

export class Paths {
  constructor() {
    this.rootDir = ''
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
