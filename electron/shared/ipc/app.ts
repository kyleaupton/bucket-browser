import { IpcChannel } from 'typed-electron-ipc';

export const getObjectImage: IpcChannel<[string], string> = {
  name: '/app/object-image',
};

export const getFolderImage: IpcChannel<[], string> = {
  name: '/app/folder-image',
};

export const getBucketImage: IpcChannel<[], string> = {
  name: '/app/bucket-image',
};
