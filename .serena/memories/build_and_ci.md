# Build & CI

## GitHub Actions — Android APK
- `.github/workflows/build-android.yml`: builds a release APK on `v*` tags AND on manual `workflow_dispatch` (use `gh workflow run build-android.yml --ref main` to iterate without tagging). Node 20, JDK 17, `npm install` (NOT `npm ci` — the lock drifts because it's generated on a much newer local npm than CI). Uploads the APK as an artifact; the "Attach APK to release" step is gated `if: startsWith(github.ref, 'refs/tags/')` so only tags create a GitHub Release.
- Release APK signs with the **debug keystore** (`android/app/debug.keystore`, present in repo) via `signingConfigs.debug` — installable but NOT Play-Store-publishable. Needs a real keystore (as a GH secret) before store release.

## ffmpeg-kit is retired — CRITICAL build gotcha
`ffmpeg-kit-react-native@6.0.2` (used for recording) depends on `com.arthenica:ffmpeg-kit-https:6.0-2`, which was **purged from Maven Central** when arthenica retired ffmpeg-kit (April 2025). A clean build (CI, fresh gradle cache) fails: "Could not find com.arthenica:ffmpeg-kit-https:6.0-2".
Fix (gradle-only, no JS/npm change) in `android/build.gradle`:
```
allprojects { configurations.all { resolutionStrategy.dependencySubstitution {
  substitute module("com.arthenica:ffmpeg-kit-https") using module("io.github.maitrungduc1410:ffmpeg-kit-https:6.0.6")
}}}
```
`io.github.maitrungduc1410:ffmpeg-kit-https` (versions 6.0.1/6.0.6/7.1.5/8.1.2 on Maven Central) is an API-compatible rebuild keeping the `com.arthenica.ffmpegkit` Java namespace; 6.0.6 matches the 6.0 line. Its POM pulls `com.arthenica:smart-exception-java:0.2.1` (still on Maven Central).

## App naming
Display name is **adorableNTRtv** (Android `strings.xml app_name`, iOS `CFBundleDisplayName`, `app.json displayName`). Internal identifiers are UNCHANGED and must stay so: `app.json name` = `adorableNTR` (AppRegistry key, paired with MainActivity.getMainComponentName + iOS moduleName), Android applicationId `com.adorableNTR`. See `mem:core`, `mem:android_tv_support`.

## Web preview
`npm run web` → Vite dev server at http://localhost:5173/web/index.html renders MainWindow/HelpModal via react-native-web (native modules stubbed under `web/stubs/`). UI-only; streaming can't run on web.
