
import type { CompareSnapshotOptions } from './options'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * custom command to take screenshots and compare them with their baseline images
       */
      compareSnapshot(options: string | CompareSnapshotOptions): Chainable<Element>
      /**
       * custom command to hide/unhide elements
       */
      hideElement(hide?: boolean): void
    }
  }
}

declare function compareSnapshotCommand(): void

export default compareSnapshotCommand;
