import { existsSync, mkdirSync, emptyDirSync, readdirSync, moveSync, copySync, writeFile } from 'fs-extra'
import { createDir, cleanDir, renameAndMoveFile, renameAndCopyFile, getRelativePathFromCwd, getCleanDate, writeFileIncrement } from './utils'

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  emptyDirSync: jest.fn(),
  readdirSync: jest.fn(),
  moveSync: jest.fn(),
  copySync: jest.fn(),
  writeFile: jest.fn(),
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

  describe('Move files', () => {
    it('should move files', () => {
      renameAndMoveFile(sampleFiles[0], sampleFiles[1])
      expect(moveSync).toHaveBeenCalledTimes(1)
      expect(moveSync).toBeCalledWith(sampleFiles[0], sampleFiles[1], {"overwrite": true})
    })
  })

  describe('Copy files', () => {
    it('should copy files', () => {
      renameAndCopyFile(sampleFiles[0], sampleFiles[1])
      expect(copySync).toHaveBeenCalledTimes(1)
      expect(copySync).toBeCalledWith(sampleFiles[0], sampleFiles[1], {"overwrite": true})
    })
  })

  describe('Get relative path from the current working directory', () => {
    const processCwd = jest.spyOn(process, 'cwd')
    const fakeCwd = 'User/my-project/'

    beforeEach(() => {
      processCwd.mockReturnValue(fakeCwd)
    })

    it('should return empty string when path doesn\'t exist', () => {
      existsSync.mockReturnValue(false)
      
      const relativePath = getRelativePathFromCwd('User/my-project/cypress/screenshot.png')
      expect(relativePath).toBe('')
    })
  
    it('should return a relative path when given path exists', () => {
      existsSync.mockReturnValue(true)

      const relativePath = getRelativePathFromCwd('User/my-project/cypress/screenshot.png')
      expect(relativePath).toBe('cypress/screenshot.png')
    })
  })

  describe('Get clean date string', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should return a clean date string', () => {
      const fakeDate = '01/09/2023, 23:22:48'
      jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue(fakeDate)

      expect(getCleanDate()).toBe('01-09-2023_232248')
    })
  })

  describe('Write incremented filename', () => {
    const filename = 'User/my-project/report.json'
    const filenameIncremented = 'User/my-project/report_2.json'
    const fakeData = '{\n  "name": "test"\n}'

    it('should create a new file with given name when no filename found', () => {
      existsSync.mockReturnValue(false)

      writeFileIncrement(filename, fakeData)
      expect(writeFile).toHaveBeenCalledTimes(1)
      expect(writeFile).toBeCalledWith(filename, fakeData)
    })

    it('should increment filename when it already exists', () => {
      existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false)

      writeFileIncrement(filename, fakeData)
      expect(writeFile).toHaveBeenCalledTimes(1)
      expect(writeFile).toBeCalledWith(filenameIncremented, fakeData)
    })
  })
})
