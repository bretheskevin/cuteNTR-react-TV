import {Platform, NativeModules} from 'react-native';
import RNFS from 'react-native-fs';

const GITHUB_API_URL =
  'https://api.github.com/repos/bretheskevin/cuteNTR-react-TV/releases/latest';

interface UpdateInfo {
  versionName: string;
  apkUrl: string;
}

function computeVersionCode(versionName: string): number {
  const parts = versionName.replace(/^v/, '').split('.');
  const major = parseInt(parts[0] || '0', 10);
  const minor = parseInt(parts[1] || '0', 10);
  const patch = parseInt(parts[2] || '0', 10);
  return major * 10000 + minor * 100 + patch;
}

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  if (Platform.OS !== 'android') {
    return null;
  }
  if (!NativeModules.AppUpdate) {
    return null;
  }

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {Accept: 'application/vnd.github.v3+json'},
    });
    if (!response.ok) {
      return null;
    }

    const release = await response.json();
    const tagName: string = release.tag_name;
    const remoteVersionName = tagName.replace(/^v/, '');
    const remoteVersionCode = computeVersionCode(remoteVersionName);

    const localVersionCode: number =
      await NativeModules.AppUpdate.getVersionCode();

    if (remoteVersionCode <= localVersionCode) {
      return null;
    }

    const apkAsset = (release.assets || []).find((asset: {name: string}) =>
      asset.name.endsWith('.apk'),
    );
    if (!apkAsset) {
      return null;
    }

    return {
      versionName: remoteVersionName,
      apkUrl: apkAsset.browser_download_url,
    };
  } catch {
    return null;
  }
}

export async function downloadAndInstall(
  apkUrl: string,
  onProgress?: (percent: number) => void,
): Promise<void> {
  const destPath = `${RNFS.CachesDirectoryPath}/update.apk`;

  try {
    const exists = await RNFS.exists(destPath);
    if (exists) {
      await RNFS.unlink(destPath);
    }
  } catch {
    // ignore cleanup errors
  }

  const result = RNFS.downloadFile({
    fromUrl: apkUrl,
    toFile: destPath,
    progress: res => {
      if (onProgress && res.contentLength > 0) {
        onProgress(Math.round((res.bytesWritten / res.contentLength) * 100));
      }
    },
    progressInterval: 500,
  });

  const downloadResult = await result.promise;
  if (downloadResult.statusCode !== 200) {
    throw new Error(`Download failed with status ${downloadResult.statusCode}`);
  }

  await NativeModules.AppUpdate.installApk(destPath);
}
