import { Paths } from './config'

describe('Path config', () => {
  const processCwd = jest.spyOn(process, 'cwd')

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return default folder structure', () => {
    processCwd.mockReturnValue('User/my-project/')

    const paths = new Paths()

    expect(paths.image.baseline('test')).toBe(
      'User/my-project/cypress-visual-screenshots/baseline/test.png'
    )
    expect(paths.image.comparison('test')).toBe(
      'User/my-project/cypress-visual-screenshots/comparison/test.png'
    )
    expect(paths.image.diff('test')).toBe(
      'User/my-project/cypress-visual-screenshots/diff/test.png'
    )

    expect(paths.dir).toEqual({
      baseline: 'User/my-project/cypress-visual-screenshots/baseline',
      comparison: 'User/my-project/cypress-visual-screenshots/comparison',
      diff: 'User/my-project/cypress-visual-screenshots/diff',
    })

    expect(paths.reportDir).toBe('User/my-project/cypress-visual-report')

    expect(paths.report('test')).toBe(
      'User/my-project/cypress-visual-report/cypress-visual-reporttest.html'
    )
  })

  it('should return custom folder structure', () => {
    processCwd.mockReturnValue('User/my-project/')

    const paths = new Paths()
    paths.rootDir = 'visual-test/custom-folder-name'

    expect(paths.image.baseline('test')).toBe(
      'User/my-project/visual-test/custom-folder-name/cypress-visual-screenshots/baseline/test.png'
    )
    expect(paths.image.comparison('test')).toBe(
      'User/my-project/visual-test/custom-folder-name/cypress-visual-screenshots/comparison/test.png'
    )
    expect(paths.image.diff('test')).toBe(
      'User/my-project/visual-test/custom-folder-name/cypress-visual-screenshots/diff/test.png'
    )

    expect(paths.dir).toEqual({
      baseline:
        'User/my-project/visual-test/custom-folder-name/cypress-visual-screenshots/baseline',
      comparison:
        'User/my-project/visual-test/custom-folder-name/cypress-visual-screenshots/comparison',
      diff:
        'User/my-project/visual-test/custom-folder-name/cypress-visual-screenshots/diff',
    })

    expect(paths.reportDir).toBe(
      'User/my-project/visual-test/custom-folder-name/cypress-visual-report'
    )

    expect(paths.report('test')).toBe(
      'User/my-project/visual-test/custom-folder-name/cypress-visual-report/cypress-visual-reporttest.html'
    )
  })
})
