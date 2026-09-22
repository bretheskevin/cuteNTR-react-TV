import React from 'react';
import {View} from 'react-native-web';

export * from 'react-native-web';

export const TVFocusGuideView = ({children, style}) =>
  React.createElement(View, {style}, children);

export const PermissionsAndroid = {
  request: async () => 'granted',
  check: async () => true,
  PERMISSIONS: {},
  RESULTS: {GRANTED: 'granted', DENIED: 'denied'},
};
