exports.config = {
  framework: 'mocha',
  mochaOpts: {
     timeout: 30000
  },
  // The file path to the selenium server jar ()
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
  // seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: ['tests/e2e/ideas.protractor.js']
};
