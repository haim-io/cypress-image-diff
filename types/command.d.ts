
import type { CompareSnapshotOptions } from './options'

declare namespace Cypress {
  interface Chainable<Subject = any> {
    compareSnapshot(options: string | CompareSnapshotOptions): Chainable<Element>
  }
}

declare function compareSnapshotCommand(): void

export default compareSnapshotCommand;
