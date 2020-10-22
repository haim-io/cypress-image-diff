# Getting started

Once you have setup cypress and followed [Cypress integration](./Cypress%20integration.md) you can start writing tests

## Setup

Install cypress image diff package

`npm i -D cypress-image-diff-js`

## Writing a test

Create a spec file under cypress integration folder i.e `cypress/integration/specs/some-test-spec.js`

Then use the cypress image diff command to take screenshots of pages or elements:

### Take screenshot and compare of the whole page

```
describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('www.google.com')
    cy.compareSnapshot('home-page')
  })
})
```

You can also make the comparison assertion more flexible by applying a higher threshold (default is 0):

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

## Force resolution size

In order to force the screenshot resolution when running a test you will need to set the following environment variables:

```
export HEIGHT=2240 // Default is set to 1280
export WIDTH=1980 // Default is set to 720
```

### Please notice

Be aware that despite forcing a screenshot resolution to a particular height and width for a test, if this test is run on different machinary i.e a 13inch mac vs computer attached to a 30inch monitor, the results will defer. So it's extremely important that you standerise where the tests will run, both locally and CI.

One way to handle this is by running them against a docker container. This project tests use a container to run the tests so it could be used as an example.
