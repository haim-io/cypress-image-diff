///<reference types="cypress" />

import type { RecurseDefaults } from 'cypress-recurse'

export interface CompareSnapshotOptions {
    /**
     * The name of the snapshots that will be generated
     */
    name: string
    /**
     * The snapshot naming pattern using replaceable labels. All possible labels are: specName, givenName, browserName, width and height. 
     * All labels in square brackets are replaced with actual values during runtime.
     * giveName is the name property above. 
     * @default undefined
     * @example '[browserName]/[specName]-[givenName].[width]x[height]'
     */
    nameTemplate?: string
    /**
     * A number between 0 and 1 that represents the allowed percentage of pixels that can be different between the two snapshots
     * @default 0
     */
    testThreshold?: number
    /**
     * @see {@link RecurseDefaults}
     * @default {limit:1}
     */
    retryOptions?: Partial<typeof RecurseDefaults>
    /**
     * If set to true, will use the given name as it is without transforming it to [spec_file_name]-[name]
     * @default false
     */
    exactName?: boolean
    /**
     * options object to change the default behavior of cy.screenshot()
     * @default undefined
     */
    cypressScreenshotOptions?: Partial<
        Cypress.ScreenshotOptions & Cypress.Loggable & Cypress.Timeoutable
    >
}
