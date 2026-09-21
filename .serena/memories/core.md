# CuteNTR / AdorableNTR — source map

React Native 0.74 app that streams Nintendo 3DS video over TCP/UDP (BootNTR / HzMod). Repo: bretheskevin/cuteNTR-react-TV (fork of Auth-Xero/adorableNTR-react). npm package name: `adorableNTR`.

- `App.tsx` — root class component. Owns ALL app state (connection settings, streaming flags, recording, hzMod toggle) and persists a subset to AsyncStorage key `appSettings`. Screen switching is manual (`currentScreen: 'Home' | 'StreamWindow'`), NOT a navigation library (react-navigation deps exist but are unused for routing).
- `components/MainWindow.tsx` — home screen: IP input, settings (qos, priority, jpeg quality, recording toggle/path, cpu limit, hzMod toggle), connect/stream buttons.
- `components/ntr/Ntr.tsx` — NTR protocol client (TCP commands to 3DS port 8000/8001).
- `components/hzmod/HzMod.tsx` — HzMod UDP-based alternative protocol client.
- `components/stream/StreamWorker.tsx` — TCP video frame receiver (screen data).
- `components/stream/StreamWindow.tsx` — renders stream + touch input overlay (treats 3DS screens as touch surface).
- Native JPEG decode: iOS `ios/JpegVideoView.m`, `ios/ImageProcessorModule.mm`; Android side under `android/app/src/main/jni` (referenced by README; path may differ — check android tree).
- Cross-component comms: `react-native-event-listeners` EventRegister events (`stream`, `stopStream`, `hzStream`, `stopHzStream`, `ntrCommand`, `ntrConnectToDs`, `stateChanged`, `ntrStateChanged`).

- `components/tv/` — TV foundation module (Task 1). Exports: `isTV` (boolean, Platform.isTV-based), theme constants (`FOCUS_RING_COLOR` #BB86FC, `FOCUS_RING_WIDTH` 3, `OVERSCAN`, `TV_MIN_TARGET_SIZE`, `tvFontScale`, `tvPadding`), and `Focusable` wrapper (functional component with D-pad focus ring). Android TV only; no native module needed (Platform.isTV reliable in RN 0.74 via uiMode==='tv').

## Invariants
- Do NOT introduce react-navigation for routing; App.tsx conditional rendering is the established pattern.
- Settings persistence happens in `App.componentDidUpdate` — add new persisted settings to that object or they silently won't save.
- Stream must keep running when navigating back (see `navigateBack` comment).
