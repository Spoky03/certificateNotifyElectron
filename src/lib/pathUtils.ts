
import path from 'path';
import { platform } from 'os';
import { app } from 'electron';

export function getPlatform() {
    switch (platform()) {
      case 'aix':
      case 'freebsd':
      case 'linux':
      case 'openbsd':
      case 'android':
        return 'linux';
      case 'darwin':
      case 'sunos':
        return 'mac';
      case 'win32':
        return 'win';
      default:
        return null;
    }
  }
  
  export function getBinariesPath() {
    console.log(process.resourcesPath)
    const IS_PROD = process.env.NODE_ENV === 'production';
    const { isPackaged } = app;
  
    const binariesPath =
      IS_PROD && isPackaged
        ? path.join(process.resourcesPath, './bin')
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        : path.join(app.getAppPath(), 'resources', getPlatform()!);
    return binariesPath;
  }
  
  // openssl
  export const opensslPath = path.resolve(path.join(getBinariesPath(), './openssl/openssl'));