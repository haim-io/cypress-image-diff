import colors from 'colors/safe'
import { copySync, readdirSync } from 'fs-extra'

import { cli } from './cli'

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  copySync: jest.fn(),
  readdirSync: jest.fn(),
}))

console.log = jest.fn()

describe('Cli', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Update baseline images', () => {
    it('should not update baseline images if argument is not specified', () => {
      cli(['--dummyArg1', '--dummyArg2'])
      expect(copySync).toHaveBeenCalledTimes(0)
    })

    it('should update baseline images if argument is specified', () => {
      const files = ['File1.png', 'File2.png']
      readdirSync.mockReturnValue(files)

      cli(['--dummyArg1', '--dummyArg2', '-u'])
      expect(copySync).toHaveBeenCalledTimes(2)
      expect(console.log.mock.calls[0][0]).toBe(colors.green(`Updated baseline image ${files[0]}`))
      expect(console.log.mock.calls[1][0]).toBe(colors.green(`Updated baseline image ${files[1]}`))
    })

    it('should ignore the first 2 arguments', () => {
      cli(['-u', '-u'])
      expect(copySync).toHaveBeenCalledTimes(0)
    })

    it('should output message when no images to be updated', () => {
      readdirSync.mockReturnValue()
      cli(['--dummyArg1', '--dummyArg2', '-u'])

      const expectedOutput = 'No baselines to be updated. Make sure to run the visual tests before running update.'
      expect(console.log.mock.calls[0][0]).toBe(colors.yellow(expectedOutput))
    })
  })
})
