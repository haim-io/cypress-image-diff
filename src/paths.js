import path from 'path'

const paths = (config= {}) => {
    const {
        screenshotsFolder,
        reportFolder
    } = config;
    const parentDir = path.join(process.cwd(), screenshotsFolder || 'cypress-visual-screenshots');
    const baseline = path.join(parentDir, 'baseline')
    const comparison = path.join(parentDir, 'comparison')
    const diff = path.join(parentDir, 'diff')
    const reportDir = path.join(process.cwd(), (reportFolder || 'cypress-visual-report'));

    
    return {
        image: {
            baseline: (testName) => path.join(baseline, `${testName}.png`),
            comparison: (testName) => path.join(comparison, `${testName}.png`),
            diff: (testName) => path.join(diff, `${testName}.png`),
        },
        dir: {
            baseline,
            comparison,
            diff,
            report: reportDir
        },
        parentDir,
        report: (instance = '') => path.join(reportDir, `${instance || "index"}.html`)
    }
}

export default paths;
