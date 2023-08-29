# cypress-image-diff

Visual regression test with cypress

This tool was created to make visual regression as simple as possible, by exposing basic functions that allow you to view the difference between images.
The wrapper uses [pixelmatch](https://github.com/mapbox/pixelmatch) which is simple and powerful and relies on [cypress](https://github.com/cypress-io) to take screenshots.

[![NPM Downloads][npm-downloads-image]][npm-url]

[![Build Status][circleci-image]][circleci-url]

[![Version][version-image]][version-url]

[npm-downloads-image]: https://badgen.net/npm/dm/cypress-image-diff-js
[npm-url]: https://www.npmjs.com/package/cypress-image-diff-js
[circleci-url]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main
[circleci-image]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main.svg?style=svg
[version-image]: https://img.shields.io/npm/v/cypress-image-diff-js.svg
[version-url]: https://www.npmjs.com/package/cypress-image-diff-js

## Table of contents
- [Cypress integration](./docs/Cypress%20integration.md)
- [CLI](./docs/CLI.md)
- [Reporting](./docs/Reporting.md)
- [Running tests](./docs/Running%20tests.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Publishing](./docs/Publishing.md)

## Getting started

Once you have setup cypress and followed [Cypress integration](./docs/Cypress%20integration.md) you can start writing tests

### Writing a test

Create a spec file under cypress integration folder i.e `cypress/integration/specs/some-test-spec.js`

Then use the cypress image diff command to take screenshots of pages or elements:

### Take screenshot and compare the whole page

```js
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    cy.compareSnapshot('home-page')
  })
})
```

You can also make the comparison assertion more flexible by applying a higher threshold (default is 0):

```js
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    cy.compareSnapshot('home-page-with-threshold', 0.2)
  })
})
```

You can also retry the snapshot comparison by passing in an optional third parameter. It accepts the same options as [cypress-recurse](https://github.com/bahmutov/cypress-recurse#options).

```js
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    const retryOptions = {
      limit: 5, // max number of retries
      delay: 500 // delay before next iteration, ms
    }
    cy.compareSnapshot('home-page-with-threshold', 0, retryOptions)
  })
})
```

### Take screenshot and compare an element

```js
describe('Visuals', () => {
  it('should compare screenshot from a given element', () => {
    cy.visit('www.google.com')
    cy.get('#report-header').compareSnapshot('search-bar-element')
  })
})
```

### Hiding an element before taking a screenshot

```js
describe('Visuals', () => {
  it('should compare screenshot from a given element', () => {
    cy.visit('www.google.com')
    cy.get('#report-header').hideElement() // hideElement(false) to unhide
    cy.compareSnapshot('search-bar-element')
  })
})
```

### Custom config file

If you'd like to take advantages of additional features, you will need to set up the custom config file.

Create a file called `cypress-image-diff.config.js`. This should live along side `cypress.config.js`, in the root of the directory.

```js
// cypress-image-diff.config.js
const config = {
  ROOT_DIR: 'custom-folder-name',
};

module.exports = config;

```

Currently supported values in the custom config file:

- ROOT_DIR (value relative to the root of the directory)
- FAILURE_THRESHOLD: must be between 0 and 1, default to 0
- RETRY_OPTIONS: see [retry options](https://www.npmjs.com/package/cypress-recurse#options)
- FAIL_ON_MISSING_BASELINE: a boolean to determine whether to fail a test if its baseline doesn't exist, default to false
- COMPARISON_OPTIONS: custom options passed to pixelmatch, see [pixelmatch options](https://github.com/mapbox/pixelmatch#api), default to `{ threshold: 0.1 }`. Please note that the `COMPARISON_OPTIONS.threshold` is different from the `FAILURE_THRESHOLD` above:
  - `COMPARISON_OPTIONS.threshold`: is the failure threshold for every pixel comparision
  - `FAILURE_THRESHOLD`: is the failure threshold for the whole comparision
- JSON_REPORT: 
  - FILENAME: custom name for the json report file, default to `report_[datetime].json` in which `[datetime]` will be replaced with a timestamp. (ie. `report_29-08-2023_233219.json`)
  - OVERWRITE: set to false if you don't want to overwrite existing report files, default to true. If a duplicate filename is found, the report will be saved with a counter digit added to the filename. (ie.`custom_report_name_1.json`)

> **Note**: In order to make this custom config values effective, remember to return `getCompareSnapshotsPlugin` instance inside function `setupNodeEvents`:

```
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
     return getCompareSnapshotsPlugin(on, config);
    },
  },
})
```

### Updating baseline images

If there are wanted changes to the application in test and if we need to update baseline images, you can follow the steps in [CLI](./docs/CLI.md) documentation to update the baselines.

Alternatively, you can delete the baseline image that you wish to be updated and rerun the tests, this will create a new baseline image with the updated image.

### Folder structure

This folder structure will be created by default at the root of your project where your `package.json` lives:

```
    .
    ├── cypress-visual-screenshots
        ├── baseline
        ├── comparison
        ├── diff
    ├── cypress-visual-report
```

In some cases, you may want to modify the folder structure relative to the directory. To accomplish this you will need to set a value on the ROOT_DIR key value on the `cypress-image-diff.config.js` [custom config file](#custom-config-file). `ROOT_DIR` is a path relative to the current working directory.

```js
// cypress-image-diff.config.js
const config = {
  ROOT_DIR: 'visual-test/custom-folder-name',
};

module.exports = config;

```
Output directory:
```
    .
    ├── visual-test
        ├── custom-folder-name
            ├── cypress-visual-screenshots
                ├── baseline
                ├── comparison
                ├── diff
            ├── cypress-visual-report
```

### Force resolution size

In order to force the screenshot resolution when running a test you will need to set the following cypress config values in `cypress.json`:

```js
{
  "viewportWidth": 1000, // Default value: 1280
  "viewportHeight": 660 // Default value: 720
}
```

### Preserving the original screenshot
All screenshots will be renamed and moved from the default screenshot location to a new screenshot folder structure. To preserve the screenshot in the original location, set the following values in `cypress.json`:

```json
{
  "env": {
    "preserveOriginalScreenshot": true
  }
}
```

### Please notice

Be aware that despite forcing a screenshot resolution to a particular height and width for a test, if this test is run on different computers (i.e a 13" Mac vs PC attached to a 30" monitor), the results will be different. So it's extremely important that you standardize where the tests will run, both locally and CI.

One way to handle this, is by running it with docker container. This project tests use a docker container to run the tests so it could be used as an example.
