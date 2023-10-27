import fs from 'fs-extra'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import path from 'path'

import {
  createDir,
  cleanDir,
  adjustCanvas,
  parseImage,
  setFilePermission,
  renameAndMoveFile, renameAndCopyFile,
  getRelativePathFromCwd,
  getCleanDate,
  writeFileIncrement
} from './utils'
import paths, { userConfig } from './config'
import TestStatus from './reporter/test-status'
import { createReport } from './reporter'

let testStatuses = []

const setupFolders = () => {
  createDir([paths.dir.baseline, paths.dir.comparison, paths.dir.diff, paths.reportDir])
}

const tearDownDirs = () => {
  cleanDir([paths.dir.comparison, paths.dir.diff])
}

const generateReport = (instance = '') => {
  if (testStatuses.length > 0) {
    createReport({ tests: JSON.stringify(testStatuses), instance })
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

const getStatsComparisonAndPopulateDiffIfAny = async (args) => {
  let baselineImg
  try {
    baselineImg = await parseImage(paths.image.baseline(args.testName))
  } catch (e) {
    return args.failOnMissingBaseline
      ? { percentage: 1, testFailed: true }
      : { percentage: 0, testFailed: false }
  }

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
    userConfig.COMPARISON_OPTIONS
  )
  
  const percentage = (pixelMismatchResult / diff.width / diff.height) ** 0.5
  const testFailed = percentage > args.testThreshold

  if (testFailed) {
    fs.ensureFileSync(paths.image.diff(args.testName))
    diff.pack().pipe(fs.createWriteStream(paths.image.diff(args.testName)))
  }

  return { percentage, testFailed }
}

async function compareSnapshotsPlugin(args) {
  const { percentage, testFailed } = await getStatsComparisonAndPopulateDiffIfAny(args)

  // Saving test status object to build report if task is triggered
  testStatuses.push(new TestStatus({ 
    status: !testFailed,
    name: args.testName,
    percentage,
    failureThreshold: args.testThreshold,
    specFilename: args.specFilename,
    specPath: args.specPath,
    baselinePath: getRelativePathFromCwd(paths.image.baseline(args.testName)),
    diffPath: getRelativePathFromCwd(paths.image.diff(args.testName)),
    comparisonPath: getRelativePathFromCwd(paths.image.comparison(args.testName)),
  }))

  return percentage
}

const generateJsonReport = async (results) => {
  const testsMappedBySpecPath = testStatuses.reduce((map, item) => {
    if (map[item.specPath] === undefined) {
      // eslint-disable-next-line no-param-reassign
      map[item.specPath] = {
        name: item.specFilename,
        path: item.specPath,
        tests: []
      }
    }
    map[item.specPath].tests.push(item)

    return map
  }, {})

  const suites = Object.values(testsMappedBySpecPath)
  const totalPassed = testStatuses.filter(t => t.status === 'pass' ).length

  const stats = {
    total: testStatuses.length,
    totalPassed,
    totalFailed: testStatuses.length - totalPassed,
    totalSuites: suites.length,
    suites,
    startedAt: results.startedTestsAt,
    endedAt: results.endedTestsAt,
    duration: results.totalDuration,
    browserName: results.browserName,
    browserVersion: results.browserVersion,
    cypressVersion: results.cypressVersion,
  }

  const jsonFilename = userConfig.JSON_REPORT.FILENAME
  ? `${userConfig.JSON_REPORT.FILENAME}.json`
  : `report_${getCleanDate(stats.startedAt)}.json`

  const jsonPath = path.join(paths.reportDir, jsonFilename)
  if (userConfig.JSON_REPORT.OVERWRITE) {
   await fs.writeFile(jsonPath, JSON.stringify(stats, null, 2))
  } else {
   await writeFileIncrement(jsonPath, JSON.stringify(stats, null, 2))
  }
}

const getCompareSnapshotsPlugin = (on, config) => {
  // Create folder structure
  setupFolders()

  // Delete comparison and diff images to ensure a clean run
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
  on('after:screenshot', async function (details) {
    if (details.testFailure) {
      return;
    }
  
    // Your existing code to change screenshots file permissions
    (0, _utils.setFilePermission)(details.path, 511);
    (0, _utils.setFilePermission)(_config["default"].image.comparison(details.name), 511);
  
    // Now, add the code to crop the screenshot
    const inputImagePath = details.path;
    const cropOptions = { left: 470, top: 80, width: 3330, height: 1200 }; // Define your crop options
    const croppedImagePath = _config["default"].image.comparison(details.name); // Use the same path for the cropped image as for the comparison image
  
    try {
      // Read the original image
      const originalImage = fs.readFileSync(inputImagePath);
      const originalPng = _pngjs.PNG.sync.read(originalImage);
  
      // Create a new PNG instance for the cropped image
      const croppedPng = new _pngjs.PNG({
        width: cropOptions.width,
        height: cropOptions.height,
      });
  
      // Crop the image
      for (let y = 0; y < cropOptions.height; y++) {
        for (let x = 0; x < cropOptions.width; x++) {
          const originalIdx = (cropOptions.top + y) * originalPng.width * 4 + (cropOptions.left + x) * 4;
          const croppedIdx = y * croppedPng.width * 4 + x * 4;
  
          for (let i = 0; i < 4; i++) {
            croppedPng.data[croppedIdx + i] = originalPng.data[originalIdx + i];
          }
        }
      }
  
      // Save the cropped image
      const croppedImageData = _pngjs.PNG.sync.write(croppedPng);
      fs.writeFileSync(croppedImagePath, croppedImageData);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  });

  on('after:run', async (results) => {
    if (userConfig.JSON_REPORT) {
      await generateJsonReport(results)
    }
  })

  on('task', {
    compareSnapshotsPlugin,
    copyScreenshot,
    deleteScreenshot,
    generateReport,
    deleteReport,
  })

  // eslint-disable-next-line no-param-reassign
  config.env.cypressImageDiff = userConfig

  return config
}

module.exports = getCompareSnapshotsPlugin
