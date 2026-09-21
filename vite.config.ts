import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: false,
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'web/stubs/react-native.js'),
      'react-native-tcp-socket': path.resolve(
        __dirname,
        'web/stubs/tcp-socket.js',
      ),
      'react-native-udp': path.resolve(__dirname, 'web/stubs/udp.js'),
      'react-native-fs': path.resolve(__dirname, 'web/stubs/fs.js'),
      'react-native-event-listeners': path.resolve(
        __dirname,
        'web/stubs/event-listeners.js',
      ),
      'ffmpeg-kit-react-native': path.resolve(__dirname, 'web/stubs/ffmpeg.js'),
      'react-native-fast-image': 'react-native-web',
      'rn-fetch-blob': path.resolve(__dirname, 'web/stubs/fetch-blob.js'),
      'react-native-immersive': path.resolve(
        __dirname,
        'web/stubs/immersive.js',
      ),
      'react-native-orientation-locker': path.resolve(
        __dirname,
        'web/stubs/orientation.js',
      ),
      '@react-native-community/checkbox': path.resolve(
        __dirname,
        'web/stubs/checkbox.js',
      ),
      '@react-native-async-storage/async-storage': path.resolve(
        __dirname,
        'web/stubs/async-storage.js',
      ),
      '@react-native-picker/picker': path.resolve(
        __dirname,
        'web/stubs/picker.js',
      ),
      '@react-native-vector-icons/ionicons': path.resolve(
        __dirname,
        'web/stubs/ionicons.js',
      ),
      'react-native-document-picker': path.resolve(
        __dirname,
        'web/stubs/document-picker.js',
      ),
      'react-native-permissions': path.resolve(
        __dirname,
        'web/stubs/permissions.js',
      ),
      'react-native-reanimated': path.resolve(
        __dirname,
        'web/stubs/reanimated.js',
      ),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'web/dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'web/index.html'),
    },
  },
});
