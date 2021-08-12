# Integration with Cypress

Follow the steps below to have access to the comparison command so you can build visual regression tests

## Setup

Install cypress:

`npm i -D cypress`

Install the package:

`npm i -D cypress-image-diff-js`

Then initialise cypress if you don't have a project:

`npx cypress open`


## Cypress plugin

import and initialise the cypress image diff plugin:

```js
// cypress/plugin/index.js
module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
  getCompareSnapshotsPlugin(on, config)
}
```

## Cypress support

import and add cypress image command:

```js
// cypress/support/commands.js
const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')
compareSnapshotCommand()
```

ensure to require the commands file:

```js
// cypress/support/index.js
require('./commands')
```
