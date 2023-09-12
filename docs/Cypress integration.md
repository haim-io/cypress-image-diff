# Integration with Cypress

Follow the steps below to have access to the comparison command so you can build visual regression tests

## Setup

Install Cypress:

```sh
npm i -D cypress
```

Install the package:

```sh
npm i -D cypress-image-diff-js
```

Then initialise Cypress if you don't have a project:

```sh
npx cypress open
```

## Cypress plugin

Import and initialise the Cypress image diff plugin:

```js
// Cypress v10+
// cypress.config.js
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin');

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return getCompareSnapshotsPlugin(on, config);
    },
  },
});

// Cypress v10+ with TypeScript
// cypress.config.ts
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/dist/plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return getCompareSnapshotsPlugin(on, config);
    },
  },
});

// Cypress < v10
// cypress/plugin/index.js
module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
  return getCompareSnapshotsPlugin(on, config)
};
```

## Cypress support

Import and add Cypress image command:

```js
// Cypress v10+
// cypress/support/{scheme}.js, where {scheme} defaults to e2e
const compareSnapshotCommand = require('cypress-image-diff-js/dist/command');
compareSnapshotCommand();

// or Cypress v10+ with TypeScript
// cypress/support/{scheme}.ts, where {scheme} defaults to e2e
import compareSnapshotCommand from 'cypress-image-diff-js/dist/command';
compareSnapshotCommand();

// Cypress < v10
// cypress/support/index.js
require('./commands');

// cypress/support/commands.js
const compareSnapshotCommand = require('cypress-image-diff-js/dist/command');
compareSnapshotCommand();
```
