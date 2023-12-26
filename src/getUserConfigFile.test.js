import fs from 'fs-extra';
import { getUserConfigFile } from './config';

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
}));

describe('getUserConfigFile', () => {
  const mockedCustomConfig = {
    ROOT_DIR: 'dir',
    CYPRESS_SCREENSHOT_OPTIONS: { disableTimersAndAnimations: false }
  };

  const mockedDefaultConfig = {
    ROOT_DIR: '',
    CYPRESS_SCREENSHOT_OPTIONS: { disableTimersAndAnimations: false }
  };

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return config from .cjs file if config file exists', () => {
    fs.existsSync.mockReturnValue(true);
    jest.doMock(`${process.cwd()}/cypress-image-diff.config.cjs`, () => mockedCustomConfig, { virtual: true });

    const config = getUserConfigFile();
    expect(config).toEqual(mockedCustomConfig);
  });

  it('should return default config if custom config does not exist', () => {
    fs.existsSync.mockReturnValue(false);
    const config = getUserConfigFile();
    expect(config).toEqual(mockedDefaultConfig);
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
