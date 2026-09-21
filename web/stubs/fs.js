const noop = async () => {};
const RNFS = {
  DocumentDirectoryPath: '/documents',
  DownloadDirectoryPath: '/downloads',
  ExternalDirectoryPath: '/external',
  readDir: noop,
  readFile: noop,
  writeFile: noop,
  unlink: noop,
  exists: async () => false,
  mkdir: noop,
  stat: noop,
};
export default RNFS;
