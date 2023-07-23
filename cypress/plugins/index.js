/* eslint-disable */
module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require('../../dist/plugin')
  return getCompareSnapshotsPlugin(on, config)
}
