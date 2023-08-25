class TestStatus {
  constructor({ status, name, percentage, failureThreshold, specPath, specFilename, baselinePath, diffPath, comparisonPath }) {
    this.status = status ? 'pass' : 'fail'
    this.name = name
    this.percentage = percentage
    this.failureThreshold = failureThreshold
    this.specPath = specPath
    this.specFilename = specFilename
    this.baselinePath = baselinePath
    this.diffPath = diffPath
    this.comparisonPath = comparisonPath
  }
}

export default TestStatus
