// eslint-disable-next-line import/no-unresolved
const compareSnapshotCommand = require('../../dist/command')

// disableTimersAndAnimations: false is necessary for retry-spec test
compareSnapshotCommand({ disableTimersAndAnimations: false });
