import { defineStore } from 'pinia';
import { _Object } from '@aws-sdk/client-s3';
import {
  getBucketImage,
  getFolderImage,
  getObjectImage,
  getOsChannel,
} from '@shared/ipc/app';
import { PersistedConnection } from '@shared/types/connections';

export type DialogConnection = {
  name: 'connection';
  data?: PersistedConnection;
};
export type DialogTransfers = { name: 'transfers' };
export type Dialog = DialogConnection | DialogTransfers;

type State = {
  // eslint-disable-next-line
  os: NodeJS.Platform | undefined;
  selectedConnection: PersistedConnection | undefined;
  path: string;
  dialog: Dialog | undefined;
  folderIcon: string;
  bucketIcon: string;
  defaultIcon: string;
  fileIcons: Record<string, string>;
};

export const useLayoutStore = defineStore('layout', {
  state: (): State => ({
    os: undefined,
    selectedConnection: undefined,
    path: '',
    dialog: undefined,
    folderIcon: '',
    bucketIcon: '',
    defaultIcon: '',
    fileIcons: {},
  }),

  actions: {
    async getOs() {
      this.os = await window.ipcInvoke(getOsChannel);
    },

    setDialog(dialog: Dialog) {
      this.dialog = dialog;
    },

    closeDialog() {
      this.dialog = undefined;
    },

    async getIcons() {
      const res = await Promise.all([
        window.ipcInvoke(getBucketImage),
        window.ipcInvoke(getFolderImage),
        window.ipcInvoke(getObjectImage, 'foo'),
      ]);

      this.bucketIcon = res[0];
      this.folderIcon = res[1];
      this.defaultIcon = res[2];
    },

    async getFileIcons(contents: _Object[]) {
      this.fileIcons = {};
      const extenstions: string[] = [];

      for (const obj of contents) {
        const _obj = window.serialize(obj)[0];
        if (_obj.Key) {
          // If object is dotfile, remove the dot
          if (_obj.Key.startsWith('.')) {
            _obj.Key = _obj.Key.slice(1);
          }

          const ext = _obj.Key.split('.').pop();
          if (ext) {
            extenstions.push(ext);
          }
        }
      }

      const getImgae = async (ext: string) => {
        this.fileIcons[ext] = await window.ipcInvoke(
          getObjectImage,
          `foo.${ext}`,
        );
      };

      await Promise.all(extenstions.map(getImgae));
    },
  },
});
