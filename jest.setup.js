jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn(() => 'listener-id'),
    removeEventListener: jest.fn(),
    emit: jest.fn(),
  },
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  ExternalDirectoryPath: '/mock/external',
  CachesDirectoryPath: '/mock/caches',
  readDir: jest.fn(() => Promise.resolve([])),
  readFile: jest.fn(() => Promise.resolve('')),
  writeFile: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve(false)),
  mkdir: jest.fn(() => Promise.resolve()),
  unlink: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-tcp-socket', () => ({
  createConnection: jest.fn(() => ({
    on: jest.fn(),
    write: jest.fn(),
    destroy: jest.fn(),
    setEncoding: jest.fn(),
  })),
  createServer: jest.fn(() => ({
    listen: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
  })),
}));

jest.mock('react-native-udp', () => ({
  createSocket: jest.fn(() => ({
    on: jest.fn(),
    bind: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
  })),
}));

jest.mock('ffmpeg-kit-react-native', () => ({
  FFmpegKit: {
    execute: jest.fn(() => Promise.resolve({getReturnCode: jest.fn()})),
    cancel: jest.fn(),
  },
  ReturnCode: {
    isSuccess: jest.fn(() => true),
  },
}));

jest.mock('@react-native-vector-icons/ionicons', () => 'Ionicons');

const {NativeModules} = require('react-native');

NativeModules.AppUpdate = {
  getVersionCode: jest.fn(() => Promise.resolve(10000)),
  getVersionName: jest.fn(() => Promise.resolve('1.0.0')),
  installApk: jest.fn(() => Promise.resolve(null)),
};
