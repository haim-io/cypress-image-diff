const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 20000,
  requestTimeout: 20000,
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: 'cypress/specs/**/*.cy.{js,jsx,ts,tsx}',
  },
})
