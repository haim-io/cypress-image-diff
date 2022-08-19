# cypress-image-diff

Visual regression test with cypress

This tool was created to make visual regression as simple as possible, by exposing basic functions that allow you to view the difference between images.
The wrapper uses [pixelmatch](https://github.com/mapbox/pixelmatch) which is simple and powerful and relies on [cypress](https://github.com/cypress-io) to take screenshots.

[![NPM Downloads][npm-downloads-image]][npm-url]

[![Build Status][circleci-image]][circleci-url]

[npm-downloads-image]: https://badgen.net/npm/dm/cypress-image-diff-js
[npm-url]: https://www.npmjs.com/package/cypress-image-diff-js
[circleci-url]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main
[circleci-image]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main.svg?style=svg

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

### Updating baseline images

If there are wanted changes to the application in test and if we need to update baseline images, you can follow the steps in [CLI](./docs/CLI.md) documentation to update the baselines.

Alternatively, you can delete the baseline image that you wish to be updated and rerun the tests, this will create a new baseline image with the updated image.

### Folder structure

Folder structure is hard coded (see below). There will be enhancements coming in to make it configurable:

```
    .
    ├── cypress-visual-screenshots
        ├── baseline
        ├── comparison
        ├── diff
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

One way to handle this is by running it with docker container. This project tests use a docker container to run the tests so it could be used as an example.
