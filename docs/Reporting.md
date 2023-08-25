# Reporting

A report can be generated after the suite is executed.

Baseline, comparison and diff images will only be added to the report for failing tests.

## Cypress support index

### Generate default HTML report
Add the following after hook

```js
// cypress/support/index.js for Cypress versions below 10
// cypress/support/{scheme}.js for Cypress versions 10 and above, where {scheme} defaults to e2e
after(() => {
  cy.task('generateReport')
})
```

The report will look something like:

![Cypress Image Diff Report](../report-example.png)

### Generate Custom HTML report
If you want to generate your custom report, pass a builder function to `HTML_REPORTER` in [custom config file](https://github.com/kien-ht/cypress-image-diff#custom-config-file). In the below example, a file named `example.json` will be generated in the current directory after all the tests are run:
```
const fs = require('fs-extra')

const config = {
  ROOT_DIR: '',
  HTML_REPORTER: (testResults) => {
    fs.writeFile('./example.json', JSON.stringify(testResults, null, 2), (err) => {
      console.log(err)
    })
  },
}

module.exports = config
```

See [example.json](./report-example.json)

## Folder structure

When a report is generated it will create the following folder:

```
    .
    ├── cypress-visual-report
```

There will be enhancements coming in to make the folder name/location configurable.
