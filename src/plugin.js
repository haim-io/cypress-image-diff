import fs from 'fs-extra'
import pixelmatch from 'pixelmatch'
import {PNG} from 'pngjs'

import {
    createDir,
    cleanDir,
    adjustCanvas,
    parseImage,
    setFilePermission,
    renameAndMoveFile
} from './utils'
import Paths from './paths'
import TestStatus from './reporter/test-status'
import {createReport} from './reporter'

const testStatuses = [];

let paths = Paths();

const prepareRequiredPaths = (options = {}) => {
    paths = Paths(options);
    createDir([paths.dir.baseline])
    cleanDir([paths.dir.comparison, paths.dir.diff, paths.dir.report])
}

const generateReport = () => {
    if (testStatuses.length > 0) {
        createReport(testStatuses, paths)
    }
    return true;
}

const copyScreenshot = options => {
    const {
        testName
    } = options;

    // If baseline does not exist, copy comparison image to baseline folder
    if (fs.existsSync(paths.image.comparison(testName)) && !fs.existsSync(paths.image.baseline(testName))) {
        fs.copySync(paths.image.comparison(testName), paths.image.baseline(testName))
    }

    return true
}

const compareSnapshotsPlugin = async (options) => {
    const {
        testName,
        testThreshold,
    } = options;
    

    const baselineImg = await parseImage(paths.image.baseline(testName))
    const comparisonImg = await parseImage(paths.image.comparison(testName))
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
        {threshold: 0.1}
    )

    const percentage = (pixelMismatchResult / diff.width / diff.height) ** 0.5
    const testFailed = percentage > testThreshold

    if (testFailed) {
        fs.ensureFileSync(paths.image.diff(testName))
        diff.pack().pipe(fs.createWriteStream(paths.image.diff(testName)))
    }

    // Saving test status object to build report if task is triggered
    testStatuses.push(new TestStatus(!testFailed, testName))

    return percentage
}


const getCompareSnapshotsPlugin = (on, config) => {
    if (fs.existsSync(config.configFile)) {
        const data = fs.readJsonSync(config.configFile)
        prepareRequiredPaths(data.cypressImageDiffConfig);
    }
    
    // Force screenshot resolution to keep consistency of test runs across machines
    on('before:browser:launch', (browser, launchOptions) => {
        const options = {...launchOptions};
        const width = process.env.WIDTH || config.viewportWidth || '1920';
        const height = process.env.HEIGHT || config.viewportHeight || '1080';
        if (browser.name === 'chrome') {
            options.args.push(`--window-size=${width},${height}`)
            options.args.push('--force-device-scale-factor=1')
        }
        if (browser.name === 'electron' && browser.isHeadless) {
            options.preferences.width = width
            options.preferences.height = height
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
            options.args.push(`--width=${width}`)
            options.args.push(`--height=${height}`)
        }
        return options;
    })

    // Intercept cypress screenshot and create a new image with our own
    // name convention and file structure for simplicity and consistency
    on('after:screenshot', (details) => {
        // Change screenshots file permission so it can be moved from drive to drive
        setFilePermission(details.path, 0o777)
        renameAndMoveFile(details.path, paths.image.comparison(details.name))
    })

    on('task', {
        compareSnapshotsPlugin,
        copyScreenshot,
        generateReport,
    })
}

module.exports = getCompareSnapshotsPlugin
