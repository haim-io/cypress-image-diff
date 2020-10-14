import fs from 'fs-extra'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

import { createDir, adjustCanvas, parseImage } from './utils'
import paths from './config'

const setupFolders = () => {
  createDir([paths.dir.baseline, paths.dir.comparison, paths.dir.diff])
}

const copyScreenshot = args => {
  // If baseline does not exist, copy comparison image to baseline folder
  if (!fs.existsSync(paths.image.baseline(args.testName))) {
    fs.copyFileSync(paths.image.comparison(args.testName), paths.image.baseline(args.testName))
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

  const comparisonFullCanvas = await adjustCanvas(
    comparisonImg,
    diff.width,
    diff.height
  )

  const baselineFullCanvas = await adjustCanvas(
    baselineImg,
    diff.width,
    diff.height
  )

  const pixelMismatchResult = pixelmatch(
    baselineFullCanvas.data,
    comparisonFullCanvas.data,
    diff.data,
    baselineFullCanvas.width,
    baselineFullCanvas.height,
    { threshold: 0.1 }
  )
  
  const percentage = (pixelMismatchResult / diff.width / diff.height) ** 0.5

  if (percentage > args.threshold) {
    diff.pack().pipe(fs.createWriteStream(paths.image.diff(args.testName)))
  }

  return percentage
}

const getCompareSnapshotsPlugin = (on) => {
  setupFolders()
  on('after:screenshot', (details) => {
    // We rename cypress screenshot and move it to our own
    // managed folder structure that lives on ./config.js
    return new Promise((resolve, reject) => {
      fs.rename(details.path, paths.image.comparison(details.name), (err) => {
        if (err) return reject(err)
        resolve({ path: paths.image.comparison(details.name) })
      })
    })
  })
  on('task', {
    compareSnapshotsPlugin,
    copyScreenshot,
  })
}

module.exports = getCompareSnapshotsPlugin
