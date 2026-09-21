const noop = () => {};
const UdpSocket = {
  createSocket: () => ({bind: noop, on: noop, close: noop, send: noop}),
};
export default UdpSocket;
