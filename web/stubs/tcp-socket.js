const noop = () => {};
const TcpSocket = {
  createServer: () => ({listen: noop, on: noop, close: noop}),
  createConnection: () => ({on: noop, write: noop, destroy: noop}),
};
export default TcpSocket;
