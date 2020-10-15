import { existsSync, mkdirSync } from 'fs-extra'
import { createDir } from './utils'

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}))

describe('Utils', () => {
  const args = ['some/path']

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Create dir', () => {
    it('should trigger create directory function when path doesn\'t exist', () => {
      existsSync.mockReturnValue(false)
      
      createDir(args)
      expect(existsSync).toHaveBeenCalledTimes(1)
      expect(mkdirSync).toHaveBeenCalledTimes(1)
      expect(mkdirSync).toBeCalledWith(args[0], { "recursive": true })
    })
  
    it('should not trigger create directory function when path exists', () => {
      existsSync.mockReturnValue(true)
      
      createDir(args)
      expect(existsSync).toHaveBeenCalledTimes(1)
      expect(mkdirSync).toHaveBeenCalledTimes(0)
    })
  })
})
