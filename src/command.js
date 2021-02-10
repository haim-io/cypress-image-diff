
const compareSnapshotCommand = (customOptions = {}) => {

    // Force screenshot resolution to keep consistency of test runs across machines
    if (!Cypress.config('viewportWidth')) {
        Cypress.config('viewportWidth', 1920);
    }
    if (!Cypress.config('viewportHeight')) {
        Cypress.config('viewportHeight', 1080);
    }

    // Disable duplicate screenshot on failure of visual regression test
    Cypress.Screenshot.defaults({
        screenshotOnRunFailure: false
    })

    return function compareSnapshot(subject, name, snapshotOptions = {}) {
        const specName = Cypress.spec.name
        const testName = `${specName.replace('.js', '')}-${name}`
        let testThreshold = snapshotOptions.testThreshold || 0;
        if (typeof snapshotOptions === 'number') {
            testThreshold = snapshotOptions;
        } 

        // Take a screenshot and copy to baseline if it does not exist
        const objToOperateOn = subject ? cy.get(subject) : cy
        objToOperateOn
            .screenshot(testName, snapshotOptions)
            .task('copyScreenshot', {
                ...customOptions,
                testName,
            })

        // Compare screenshots
        const options = {
            ...customOptions,
            testName,
            testThreshold,
        }
        cy.task('compareSnapshotsPlugin', options).then((percentage) => {
            if (percentage > testThreshold) {
                throw new Error(`The image difference percentage ${percentage} exceeded the threshold: ${testThreshold}`)
            }
        })
    }
}

const addCompareSnapshotCommand = (options = {}) => {
    const config = {
        ...Cypress.config('cypressImageDiffConfig'),
        ...options,
    };
    Cypress.Commands.add('compareSnapshot', {
        prevSubject: ['optional', 'element', 'window', 'document']
    }, compareSnapshotCommand(config));
}

export {addCompareSnapshotCommand, compareSnapshotCommand}
