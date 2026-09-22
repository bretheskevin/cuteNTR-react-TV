# Android TV + accessibility support

Added 2026-09-21. App made usable on **Android TV** (D-pad, Leanback launcher, 10-foot UI) + general a11y fixes. Same APK runs phone + TV.

## Phase A migration (2026-09-22): react-native-tvos fork
- `react-native` dependency replaced with npm alias `npm:react-native-tvos@0.74.5-0` in package.json (NO JS import changes needed).
- `npm install --legacy-peer-deps` required (peer deps check for `^0.0.0-0 || >=0.65 <1.0` which the alias version string `0.74.5-0` doesn't satisfy). CI workflow updated accordingly.
- `jest.config.js` needed `transformIgnorePatterns` override to include `@react-native-tvos` (ships ESM; `@react-native-tvos/virtualized-lists` was failing Jest parse).
- `android/app/build.gradle` changed from `com.facebook.react:react-android`/`hermes-android` to `io.github.react-native-tvos:react-android`/`hermes-android` (following fork template; fork's gradle plugin also handles this via substitution from `node_modules/react-native/ReactAndroid/gradle.properties` → `react.internal.publishingGroup=io.github.react-native-tvos`).
- `android/build.gradle` and `android/settings.gradle` UNCHANGED — includeBuild picks up fork's gradle plugin transparently; ffmpeg-kit substitution preserved.
- CI gate: `assembleRelease` in GitHub Actions verifies the Android build (not run locally — times out).

## Key gotcha (verified against node_modules)
- **Stock `react-native` 0.74 DOES expose `Platform.isTV`** — `Platform.android.js` has `get isTV() { return this.constants.uiMode === 'tv'; }`. So TV detection needs NO fork and NO native module. `components/tv/tv.ts` is just `Platform.isTV === true`.
- `onFocus`/`onBlur` and `hasTVPreferredFocus` ARE typed on the Touchable hierarchy (via TVProps), but **`focusable` is NOT typed on `TouchableOpacityProps`** — needs a narrow cast: `TouchableOpacity as React.ComponentType<TouchableOpacityProps & {focusable?: boolean}>`. See `components/tv/Focusable.tsx`.

## New module: `components/tv/`
- `tv.ts` — `isTV` boolean (Platform.isTV).
- `tvTheme.ts` — `FOCUS_RING_COLOR` (#BB86FC accent), `FOCUS_RING_WIDTH`, `OVERSCAN` (48 on TV else 0), `TV_MIN_TARGET_SIZE`, `tvFontScale()`, `tvPadding()`. All TV values gated by `isTV` so phone UI is unchanged.
- `Focusable.tsx` — wraps TouchableOpacity; `focusable` + focus-ring on focus (with a transparent idle border gated by `isTV` to avoid layout shift). Forwards onPress/style/disabled/hasTVPreferredFocus/accessibilityLabel(required)/accessibilityRole.
- `index.ts` — barrel.

## Convention for TV-specific styling
Gate every TV-only style behind `isTV` inside a style array: `[styles.base, isTV && styles.tvOverride]`. A `false` in an RN style array is ignored — never let a TV value replace a phone-required base style. TV-only style objects (e.g. `styles.tvButton`, `styles.tvIcon`) live in the same `StyleSheet.create` object.

## Native (Android TV visibility)
`android/app/src/main/AndroidManifest.xml`: added `uses-feature` touchscreen `required=false` + `leanback` `required=false`, `android:banner="@drawable/tv_banner"`, and a second `<intent-filter>` with `LEANBACK_LAUNCHER` (kept phone `LAUNCHER`). Banner asset: `res/drawable/tv_banner.png` (320x180, derived from root `appico.png`).

## Focus flow
App.tsx switches screens by ternary → each screen fully remounts, so per-screen `hasTVPreferredFocus` (MainWindow IP input via ref+useEffect; StreamWindow Back button) handles initial focus. No App.tsx change needed.

## NOT verifiable without a real Android TV (user must test)
D-pad focus routing, focus-ring visibility, ScrollView auto-scroll-to-focus, RN `Switch` D-pad reachability (fallback: wrap the switch row in `Focusable` with role "switch" toggling the value), `gradlew assembleDebug` (times out in sandbox; run locally).

## Phase B (part 1) — TV focus components (2026-09-22)
- `components/tv/FocusableSwitch.tsx` — D-pad focusable Switch row (wraps Focusable on TV, plain View on phone). Import: `import Focusable from './Focusable'` (default export — plan snippets show `{Focusable}` which is WRONG).
- `components/tv/FocusableButton.tsx` — D-pad focusable styled button for +/- controls.
- `components/tv/index.ts` — now also exports FocusableSwitch, FocusableButton, and TVFocusGuideView (re-exported from 'react-native').
- `components/MainWindow.tsx` changes:
  - Removed `InteractionManager` auto-focus trap on IP TextInput; removed `ipInputRef` and `useRef`.
  - Added `hasTVPreferredFocus={isTV}` to Start Stream Focusable button.
  - Replaced 4 bare Switch controls with FocusableSwitch.
  - Replaced 2 bare Button +/- controls with FocusableButton.
  - Removed `accessible={true}` + `accessibilityRole="adjustable"` from priority row View.
  - Wrapped ScrollView in `<TVFocusGuideView autoFocus>`.
- `TVFocusGuideView` IS typed in the fork: `node_modules/react-native/types/public/ReactNativeTVTypes.d.ts` (line 126) — safe to import from 'react-native'.

## Deferred
Removing dead deps `react-native-orientation-locker` + `react-native-immersive` (grep-confirmed unused) — skipped to avoid iOS native-linking churn. See `mem:core`, `mem:tech_stack`.
