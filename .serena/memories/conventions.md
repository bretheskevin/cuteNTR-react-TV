# Conventions

- Class components with explicit `interface XState`; handlers bound in constructor (`this.fn = this.fn.bind(this)`); arrow-function class properties also used (mixed style — match surrounding code).
- Styles via `StyleSheet.create` at file bottom, single `styles` object, `backgroundColor: '#000'` base.
- Cross-component events via `EventRegister.emit/listener`, not props/context.
- Console logging is pervasive and accepted (`console.log` per lifecycle/event).
- No comments policy in new code: existing files have comment noise; do not add explanatory comments unless they prevent a real mistake.
- No test files for components; only `__tests__/App.test.tsx` (RN template smoke test) exists. Don't add tests unless asked.
- Jest setup: `jest.setup.js` at root loaded via `setupFiles` in `jest.config.js`. Mocks: AsyncStorage (official), react-native-event-listeners, react-native-fs, react-native-tcp-socket, react-native-udp, ffmpeg-kit-react-native, @react-native-vector-icons/ionicons. `npm test` exits 0.
- Pre-commit hook: husky v9 + lint-staged. Hook at `.husky/pre-commit` runs `npx lint-staged` then `npm test`. lint-staged config in package.json: `eslint --fix` on `*.{js,jsx,ts,tsx}`.
- ESLint + Prettier enforced (RN eslint-config 0.74.84, prettier 2.8.8: double quotes? — check .prettierrc.js before editing; it overrides defaults).
