const noop = () => {};
export const EventRegister = {
  addEventListener: () => ({remove: noop}),
  removeEventListener: noop,
  emit: noop,
};
export default {addEventListener: noop, removeEventListener: noop, emit: noop};
