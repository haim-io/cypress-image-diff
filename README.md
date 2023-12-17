<p align="center">
	<a href="https://cypress.visual-image-diff.dev/"><img src="./cypress-image-diff-logo.png" width="150" /></a>
</p>

<h1 align="center">cypress-image-diff</h1>

Visual regression test with cypress

This tool was created to make visual regression as simple as possible, by exposing basic functions that allow you to view the difference between images.
The wrapper uses [pixelmatch](https://github.com/mapbox/pixelmatch) which is simple and powerful and relies on [cypress](https://github.com/cypress-io) to take screenshots.

[![NPM Downloads][npm-downloads-image]][npm-url] [![Version][version-image]][version-url] [![Build Status][circleci-image]][circleci-url] [![BrowserStack Supporter](https://img.shields.io/badge/BrowserStack-Supporter-brightgreen)](https://www.browserstack.com/) [![GitBook Supporter](https://img.shields.io/badge/GitBook-Supporter-brightgreen)](https://www.gitbook.com/)

[npm-downloads-image]: https://badgen.net/npm/dm/cypress-image-diff-js
[npm-url]: https://www.npmjs.com/package/cypress-image-diff-js
[circleci-url]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main
[circleci-image]: https://circleci.com/gh/uktrade/cypress-image-diff/tree/main.svg?style=svg
[version-image]: https://img.shields.io/npm/v/cypress-image-diff-js.svg
[version-url]: https://www.npmjs.com/package/cypress-image-diff-js

### Writing a test is as simple as this:

```js
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    cy.compareSnapshot('home-page')
  })
})
```

## Beautiful HTML Report

### Update baseline screenshots with one click

<img src="https://raw.githubusercontent.com/kien-ht/cypress-image-diff-html-report/main/assets/showcase-update-baseline.gif" alt="showcase-update-baseline"/>

### Support different screenshot inspectors

<img src="https://raw.githubusercontent.com/kien-ht/cypress-image-diff-html-report/main/assets/showcase-screenshot-inspectors.gif" alt="showcase-screenshot-inspectors"/>

## [Cypress Image Diff documentation](https://cypress.visual-image-diff.dev/)

Above you will find comprehensive documentation on how to setup this plugin within a cypress test suite
