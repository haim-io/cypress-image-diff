# Get started

Once you have setup cypress and followed [Cypress integration](./Cypress%20integration.md) you can start writing tests

## Setup

Install cypress image diff package

`npm i -D cypress-image-diff-js`

## Writing a test

Create a spec file under cypress integration folder i.e `cypress/integration/specs/some-test-spec.js`

Then use the cypress image diff command to take screen shots of pages or elements:

### Take screenshot and compare of the whole page

```
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    cy.compareSnapshot('home-page')
  })
})
```

You can also make the comparison assertion more flexible by applying a higher treshold (default is 0):

```
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    cy.compareSnapshot('home-page-with-threshold', 0.2)
  })
})
```

### Take screenshot and compare an element

```
describe('Visuals', () => {
  it('should compare screenshot from a given element', () => {
    cy.visit('www.google.com')
    cy.get('#report-header').compareSnapshot('search-bar-element')
  })
})
```

## Updating baseline images

If there are wanted changes to the application in test and if we need to update baseline image, you will have to manually copy the comparison image into the baseline folder, replacing the image.

Or deleting the baseline image that you wish to be updated and rerunning the tests, this will create a new baseline image with the updated result.

Enhancements will be built to ease the process of updating baseline images.

## Folder structure

Folder structure is hard coded (see below). There will be enhancements coming in to make it configurable:

```
    .
    ├── cypress-visual-screenshots
        ├── baseline
        ├── comparison
        ├── diff
```
