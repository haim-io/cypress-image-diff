# cypress-image-diff

Visual regression test with cypress

This tool was created to make visual regression as simple as possible, by exposing basic functions that allow you to view the difference between images.
The wrapper uses [pixelmatch](https://github.com/mapbox/pixelmatch) which is simple and powerful and relies on [cypress](https://github.com/webdriverio) to take screenshots.

[![NPM Downloads][npm-downloads-image]][npm-url]

[![Build Status][circleci-image]][circleci-url]

[npm-downloads-image]: https://badgen.net/npm/dm/cypress-image-diff-js
[npm-url]: https://www.npmjs.com/package/cypress-image-diff-js
[circleci-url]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main
[circleci-image]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main.svg?style=svg

## Table of contents

- [Get started](./docs/Get%20started.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Publishing](./docs/Publishing.md)
- [Running tests](./docs/Running%20tests.md)
- [Cypress integration](./docs/Cypress%20integration.md)
- [Reporting](./docs/Reporting.md)

## Capabilities

- Compares 2 images
- Saves baseline if no baseline is present
- Creates a diff image in case of failure
- Force browser window size (size can be modified via options)
- Take screenshot of the whole page or for a given element
- Reporting to make it easier to debug failed test results
