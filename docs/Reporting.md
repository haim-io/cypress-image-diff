# Reporting

A report can be generated after the suite is executed.

Baseline, comparison and diff images will only be added to the report for failing tests.

## Cypress support index

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

## Folder structure

When a report is generated it will create the following folder:

```
    .
    ├── cypress-visual-report
```

There will be enhancements coming in to make the folder name/location configurable.
