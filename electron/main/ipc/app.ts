import { app, nativeImage } from 'electron';
import { ipcHandle } from 'typed-electron-ipc';
import {
  getObjectImage,
  getFolderImage,
  getBucketImage,
} from '@shared/ipc/app';

export const registerAppIpc = () => {
  ipcHandle(getObjectImage, async (event, path) => {
    const thumbnail = await app.getFileIcon(path, { size: 'normal' });
    return thumbnail.toDataURL();
  });

  ipcHandle(getFolderImage, async () => {
    return (
      await nativeImage.createThumbnailFromPath('/', { height: 32, width: 32 })
    ).toDataURL();
  });

  ipcHandle(getBucketImage, async () => {
    return (
      await nativeImage.createThumbnailFromPath(
        '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFileServerIcon.icns',
        { height: 32, width: 32 },
      )
    ).toDataURL();
  });
};
