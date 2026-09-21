# Tech stack

- React Native 0.74 (arch: old-style class components, TypeScript), React 18.2, Hermes engine.
- Package manager: npm (package-lock.json + yarn.lock both present; npm scripts are authoritative; `yarn` 1.22 also a runtime dep quirk).
- iOS: Swift/Obj-C, `JpegVideoView`, `ImageProcessorModule` native modules, CocoaPods (ios/Podfile implied, .xcworkspace present).
- Android: Gradle (gradlew wrapper), JNI native JPEG processing.
- Native modules used: react-native-tcp-socket, react-native-udp, react-native-fs, rn-fetch-blob, ffmpeg-kit-react-native (recording), react-native-immersive, react-native-orientation-locker, react-native-permissions, react-native-document-picker, react-native-fast-image, @react-native-community/checkbox, @react-native-picker/picker, @react-native-vector-icons/ionicons, react-native-reanimated, react-native-event-listeners, @react-native-async-storage/async-storage.
- TypeScript 5.0.4, ESLint (RN config), Prettier 2.8.8, Jest 29.
