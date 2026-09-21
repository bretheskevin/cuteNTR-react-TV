# Task completion check

Before declaring a coding task done, from project root:
1. `npm run lint` — must pass.
2. `npx tsc --noEmit` — must pass.
3. `npm test` — existing suite must pass.
4. If Android native/manifest changed: `cd android && ./gradlew assembleDebug` must succeed.
- Note: only `App.test.tsx` exists, so jest mostly verifies the render tree still compiles.
