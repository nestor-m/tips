exports.config = {
  framework: 'mocha',
  mochaOpts: {
     timeout: 30000
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['tests/e2e/ideas.protractor.js']
};
