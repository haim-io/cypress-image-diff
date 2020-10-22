# Integration with Cypress

Follow the steps below to have access to the comparison command so you can build visual regression tests

## Setup

Install cypress:

`npm i -D cypress`

Then initialise it:

`npx cypress open`

## Cypress plugin

import and initialise the cypress image diff plugin in `cypress/plugin/index.js`:

```
module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
  getCompareSnapshotsPlugin(on, config)
}
```

### Cypress support

import and add cypress image command in `cypress/support/commands.js`:

```
const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')
compareSnapshotCommand()
```

ensure to require the commands folder in `cypress/support/index.js`:

```
require('./commands')
```
