module.exports = {
  testRegex: '/__tests__/.*\\.spec\\.ts$',
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  bail: true,
  collectCoverageFrom: [
    'src/**/*.(js|ts)'
  ],
  transform: {
    '.+\\.ts$': '<rootDir>/__tests__/preprocessor-typescript.js',
  }
};
