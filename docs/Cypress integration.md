# Integration with Cypress

Follow the steps below to have access to the comparison command so you can build visual regression tests

## Setup

Install cypress:

```sh
npm i -D cypress
```

Install the package:

```sh
npm i -D cypress-image-diff-js
```

Then initialise cypress if you don't have a project:

```sh
npx cypress open
```

## Cypress plugin

import and initialise the cypress image diff plugin:

```js
// Versions below Cypress 10
// cypress/plugin/index.js
module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
  getCompareSnapshotsPlugin(on, config)
}

// Cypress 10 and above
// cypress.config.js
const getCompareSnapshotsPlugin = require("cypress-image-diff-js/dist/plugin");

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    }
  },
});
```

## Cypress support

import and add cypress image command:

```js
// Identical setup for versions below 10 and above
// cypress/support/commands.js
const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')
compareSnapshotCommand()
```

ensure to require the commands file:

```js
// cypress/support/index.js for Cypress versions below 10
// cypress/support/{scheme}.js for Cypress versions 10 and above, where {scheme} defaults to e2e
require('./commands')
```
