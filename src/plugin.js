import fs from 'fs-extra'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

import {
  createDir,
  cleanDir,
  adjustCanvas,
  parseImage,
  setFilePermission,
  renameAndMoveFile, renameAndCopyFile
} from './utils'
import paths from './config'
import TestStatus from './reporter/test-status'
import { createReport } from './reporter'

let testStatuses = []

const setupFolders = () => {
  createDir([paths.dir.baseline, paths.dir.comparison, paths.dir.diff, paths.reportDir])
}

const tearDownDirs = () => {
  cleanDir([paths.dir.comparison, paths.dir.diff, paths.reportDir])
}

const generateReport = (instance = '') => {
  if (testStatuses.length > 0) {
    createReport({ tests: testStatuses, instance })
  }
  return true
}

const deleteReport = args => {
  testStatuses = testStatuses.filter(testStatus => testStatus.name !== args.testName)

  return true
}

const copyScreenshot = args => {
  // If baseline does not exist, copy comparison image to baseline folder
  if (!fs.existsSync(paths.image.baseline(args.testName))) {
    fs.copySync(paths.image.comparison(args.testName), paths.image.baseline(args.testName))
  }
  
  return true
}

// Delete screenshot from comparison and diff directories
const deleteScreenshot = args => {
  if (fs.existsSync(paths.image.comparison(args.testName))) {
    fs.unlinkSync(paths.image.comparison(args.testName))
  }

  if (fs.existsSync(paths.image.diff(args.testName))) {
    fs.unlinkSync(paths.image.diff(args.testName))
  }

  return true
}

async function compareSnapshotsPlugin(args) {
  const baselineImg = await parseImage(paths.image.baseline(args.testName))
  const comparisonImg = await parseImage(paths.image.comparison(args.testName))
  const diff = new PNG({
    width: Math.max(comparisonImg.width, baselineImg.width),
    height: Math.max(comparisonImg.height, baselineImg.height),
  })

  const baselineFullCanvas = await adjustCanvas(
    baselineImg,
    diff.width,
    diff.height
  )

  const comparisonFullCanvas = await adjustCanvas(
    comparisonImg,
    diff.width,
    diff.height
  )

  const pixelMismatchResult = pixelmatch(
    baselineFullCanvas.data,
    comparisonFullCanvas.data,
    diff.data,
    diff.width,
    diff.height,
    { threshold: 0.1 }
  )
  
  const percentage = (pixelMismatchResult / diff.width / diff.height) ** 0.5
  const testFailed = percentage > args.testThreshold

  if (testFailed) {
    fs.ensureFileSync(paths.image.diff(args.testName))
    diff.pack().pipe(fs.createWriteStream(paths.image.diff(args.testName)))
  }

  // Saving test status object to build report if task is triggered
  testStatuses.push(new TestStatus(!testFailed, args.testName))

  return percentage
}

const getCompareSnapshotsPlugin = (on, config) => {
  // Create folder structure
  setupFolders()

  // Delete comparison, diff images and generated reports to ensure a clean run
  tearDownDirs()

  // Force screenshot resolution to keep consistency of test runs across machines
  on('before:browser:launch', (browser, launchOptions) => {
    const width = config.viewportWidth || '1280'
    const height = config.viewportHeight || '720'

    if (browser.name === 'chrome') {
      launchOptions.args.push(`--window-size=${width},${height}`)
      launchOptions.args.push('--force-device-scale-factor=1')
    }
    if (browser.name === 'electron') {
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.width = Number.parseInt(width, 10)
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.height = Number.parseInt(height, 10)
    }
    if (browser.name === 'firefox') {
      launchOptions.args.push(`--width=${width}`)
      launchOptions.args.push(`--height=${height}`)
    }
    return launchOptions
  })

  // Intercept cypress screenshot and create a new image with our own
  // name convention and file structure for simplicity and consistency
  on('after:screenshot', details => {
    // Change screenshots file permission so it can be moved from drive to drive
    setFilePermission(details.path, 0o777)
    setFilePermission(paths.image.comparison(details.name), 0o777)

    if (config.env.preserveOriginalScreenshot === true) {
      renameAndCopyFile(details.path, paths.image.comparison(details.name))
    } else {
      renameAndMoveFile(details.path, paths.image.comparison(details.name))
    }
  })

  on('task', {
    compareSnapshotsPlugin,
    copyScreenshot,
    deleteScreenshot,
    generateReport,
    deleteReport,
  })
}

module.exports = getCompareSnapshotsPlugin
