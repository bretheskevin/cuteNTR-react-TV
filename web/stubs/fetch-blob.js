const noop = async () => {};
const RNFetchBlob = {
  config: () => ({fetch: noop}),
  fs: {dirs: {DocumentDir: '/documents', DownloadDir: '/downloads'}},
};
export default RNFetchBlob;
