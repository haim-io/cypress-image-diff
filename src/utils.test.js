import { existsSync, mkdirSync, emptyDirSync, readdirSync } from 'fs-extra'
import { createDir, cleanDir } from './utils'

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  emptyDirSync: jest.fn(),
  readdirSync: jest.fn(),
}))

describe('Utils', () => {
  const args = ['some/path']
  const sampleFiles = ['test.png', 'test1.png']

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

  describe('Clean dir', () => {
    it('should trigger clean directory function when path exists', () => {
      existsSync.mockReturnValue(true)
      readdirSync.mockReturnValue(sampleFiles)
      
      cleanDir(args)
      expect(existsSync).toHaveBeenCalledTimes(1)
      expect(emptyDirSync).toHaveBeenCalledTimes(1)
    })
  
    it('should not trigger clean directory function when path doesn\'t exist', () => {
      existsSync.mockReturnValue(false)
      
      cleanDir(args)
      expect(existsSync).toHaveBeenCalledTimes(1)
      expect(emptyDirSync).toHaveBeenCalledTimes(0)
    })
  })  
})
