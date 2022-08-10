import TestStatus from './test-status'

describe('Test Status', () => {
  it('should return pass when there is no pixel difference', () => {
    const testStatus = new TestStatus({ status: true, name: 'TestName' })
    expect(testStatus.status).toEqual('pass')
  })

  it('should return fail when there is pixel differencea', () => {
    const testStatus = new TestStatus({ status: false, name: 'TestName' })
    expect(testStatus.status).toEqual('fail')
  })
})
