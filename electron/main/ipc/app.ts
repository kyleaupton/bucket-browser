import { app, nativeImage } from 'electron';
import { createIpcHandlers } from 'typed-electron-ipc';

export const appIpc = createIpcHandlers({
  '/app/getObjectImage': async (event, path: string) => {
    const thumbnail = await app.getFileIcon(path, { size: 'normal' });
    return thumbnail.toDataURL();
  },

  '/app/getFolderImage': async () => {
    return (
      await nativeImage.createThumbnailFromPath('/', {
        height: 32,
        width: 32,
      })
    ).toDataURL();
  },

  '/app/getBucketImage': async () => {
    return (
      await nativeImage.createThumbnailFromPath(
        '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFileServerIcon.icns',
        { height: 32, width: 32 },
      )
    ).toDataURL();
  },

  '/app/getOsChannel': async () => {
    return process.platform;
  },
});
