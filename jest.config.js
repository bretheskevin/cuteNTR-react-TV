module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  forceExit: true,
  testPathIgnorePatterns: ['/node_modules/', '/web/'],
};
