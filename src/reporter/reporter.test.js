import { generateTemplate } from '.'
import TestStatus from './test-status'

describe('Reporter', () => {
  describe('create report', () => {
    it('should create html template', () => {
      const testResult1 = new TestStatus({ status: true, name: 'Visual Test 1' })
      const testResult2 = new TestStatus({ status: false, name: 'Visual Test 2' })
      const result = generateTemplate(
        { tests: [ testResult1, testResult2 ]
      })
      expect(result).toMatchSnapshot()
    })
  })
})
