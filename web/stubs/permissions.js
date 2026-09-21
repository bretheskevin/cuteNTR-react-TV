const noop = async () => 'granted';
export const check = noop;
export const request = noop;
export const PERMISSIONS = {};
export const RESULTS = {GRANTED: 'granted', DENIED: 'denied'};
export default {check, request, PERMISSIONS, RESULTS};
