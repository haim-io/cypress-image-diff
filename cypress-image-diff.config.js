const config = {
  ROOT_DIR: '',
  // disableTimersAndAnimations: false is necessary for retry-spec test
  CYPRESS_SCREENSHOT_OPTIONS: { disableTimersAndAnimations: false },
  FAIL_ON_MISSING_BASELINE: Boolean(process.env.CYPRESS_FAIL_ON_MISSING_BASELINE),
};

module.exports = config;
