# Suggested commands

From project root (macOS / bash):
- `npm start` — Metro bundler.
- `npm run android` — `react-native run-android` (needs device/emulator + Metro).
- `npm run ios` — `react-native run-ios`.
- `npm test` — jest.
- `npm run lint` — eslint on whole repo.
- Type check: `npx tsc --noEmit` (no script defined; tsconfig at root).
- Gradle: `cd android && ./gradlew assembleDebug`.
