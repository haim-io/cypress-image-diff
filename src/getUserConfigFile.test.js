import fs from 'fs-extra';
import path from 'path'
import { getUserConfigFile, getUserConfig} from './config';
import DEFAULT_CONFIG from './config.default'


jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
}));

// eslint-disable-next-line global-require, import/no-dynamic-require
const defaultJsConfig = require(path.join(process.cwd(), 'cypress-image-diff.config'))


describe('getUserConfigFile', () => {
  const mockedCustomConfig = {
    CYPRESS_SCREENSHOT_OPTIONS: { disableTimersAndAnimations: false },
    REPORT_DIR: 'custom-report',
    ROOT_DIR: 'dir',
    SCREENSHOTS_DIR: 'custom-screenshots',
  };

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return config from cypress-image-diff.config.cjs file if exists', () => {
    fs.existsSync.mockReturnValue(true);
    jest.doMock(`${process.cwd()}/cypress-image-diff.config.cjs`, () => mockedCustomConfig, { virtual: true });

    const config = getUserConfigFile();
    expect(config).toEqual(mockedCustomConfig);
  });

  it('should return config from cypress-image-diff.config.js if exists, but cypress-image-diff.config.cjs does not', () => {
    fs.existsSync.mockReturnValue(false);
    const config = getUserConfigFile();
    expect(config).toEqual(defaultJsConfig);
  });

  it('should handle error and return empty object if require fails', () => {
    fs.existsSync.mockReturnValue(true);
    jest.doMock(`${process.cwd()}/cypress-image-diff.config.cjs`, () => {
      throw new Error('Mocked error during require');
    }, { virtual: true });

    const config = getUserConfigFile();
    expect(config).toEqual({});
  });
});


describe('getUserConfig', () => {
  const mockedCustomConfig = {
    ROOT_DIR: 'other',
    CYPRESS_SCREENSHOT_OPTIONS: { disableTimersAndAnimations: false },
    REPORT_DIR: 'custom-report',
    SCREENSHOTS_DIR: 'custom-screenshots',
    FAILURE_THRESHOLD: 0.69,
    RETRY_OPTIONS: {
      log: true,
    limit: 50, 
    timeout: 30000,
    delay: 300,
    },
    FAIL_ON_MISSING_BASELINE: true,
  };

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the cypress-image-diff.config.cjs config merged with default config if .cjs config exists', () => {
    fs.existsSync.mockReturnValue(true);
    jest.doMock(`${process.cwd()}/cypress-image-diff.config.cjs`, () => mockedCustomConfig, { virtual: true });

    expect(getUserConfig()).toEqual({
      COMPARISON_OPTIONS: { threshold: 0.1 },
      CYPRESS_SCREENSHOT_OPTIONS: mockedCustomConfig.CYPRESS_SCREENSHOT_OPTIONS,
      FAILURE_THRESHOLD: mockedCustomConfig.FAILURE_THRESHOLD,
      FAIL_ON_MISSING_BASELINE: mockedCustomConfig.FAIL_ON_MISSING_BASELINE,
      JSON_REPORT: {
        FILENAME: '',
        OVERWRITE: true,
      },
      REPORT_DIR: mockedCustomConfig.REPORT_DIR,
      RETRY_OPTIONS: {
        log: true,
      limit: 50, 
      timeout: 30000,
      delay: 300,
      },
      ROOT_DIR: mockedCustomConfig.ROOT_DIR,
      SCREENSHOTS_DIR: mockedCustomConfig.SCREENSHOTS_DIR,
    });
  });

  it('should return the cypress-image-diff.config.js config merged with default config if cypress-image-diff.config.cjs does not exist', () => {
    fs.existsSync.mockReturnValue(false);

    expect(getUserConfig()).toEqual({
      ROOT_DIR: '',
      REPORT_DIR: 'cypress-image-diff-html-report',
      SCREENSHOTS_DIR: 'cypress-image-diff-screenshots',
      FAILURE_THRESHOLD: 0,
      RETRY_OPTIONS: {},
      FAIL_ON_MISSING_BASELINE: false,
      COMPARISON_OPTIONS: { threshold: 0.1 },
      JSON_REPORT: {
        FILENAME: '',
        OVERWRITE: true,
      },
      CYPRESS_SCREENSHOT_OPTIONS: { disableTimersAndAnimations: false }
    });
  });

  it('should return the default config upon getUserConfigFile() error', () => {
    jest.doMock(`${process.cwd()}/cypress-image-diff.config.js`, () => {
      throw new Error('Mocked error during require');
    }, { virtual: true });

    expect(getUserConfig()).toEqual(DEFAULT_CONFIG);
  });
});
