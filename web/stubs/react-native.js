export * from 'react-native-web';
export const PermissionsAndroid = {
  request: async () => 'granted',
  check: async () => true,
  PERMISSIONS: {},
  RESULTS: {GRANTED: 'granted', DENIED: 'denied'},
};
