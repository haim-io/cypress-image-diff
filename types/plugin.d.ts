/// <reference types="cypress" />

declare function getCompareSnapshotsPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Cypress.PluginConfigOptions

export default getCompareSnapshotsPlugin;
