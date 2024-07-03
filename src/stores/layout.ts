import { defineStore } from 'pinia';
import {
  getBucketImage,
  getFolderImage,
  getObjectImage,
  getOsChannel,
} from '@shared/ipc/app';
import { PersistedConnection } from '@shared/types/connections';
import { isObject } from '@/components/browser/utils';
import { getObjectName, getExtension } from '@/utils';
import { useBrowserStore, useTransfersStore } from '.';

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

  getters: {
    selectedBucket(state) {
      return state.path.split('/')[1];
    },
    selectedObject(state) {
      return state.path.split('/').slice(2).join('/');
    },
    browserExtensions() {
      const browserStore = useBrowserStore();
      const extensions: Record<string, string> = {};
      for (const item of browserStore.items) {
        if (isObject(item) && item.Key) {
          // Get name of object from key
          const name = getObjectName(item.Key);
          const ext = getExtension(name);
          if (ext) {
            extensions[ext] = ext;
          }
        }
      }
      return extensions;
    },
    transferExtensions() {
      const transfersStore = useTransfersStore();
      const extensions: Record<string, string> = {};
      for (const transfer of Object.values(transfersStore.transfers)) {
        const ext = getExtension(transfer.name);
        if (ext) {
          extensions[ext] = ext;
        }
      }
      return extensions;
    },
  },

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

    async getStandardIcons() {
      const res = await Promise.all([
        window.ipcInvoke(getBucketImage),
        window.ipcInvoke(getFolderImage),
        window.ipcInvoke(getObjectImage, 'foo'),
      ]);

      this.bucketIcon = res[0];
      this.folderIcon = res[1];
      this.defaultIcon = res[2];
    },

    async getFileIcons() {
      const getImage = async (ext: string) => {
        // If extension already has an icon, skip
        if (this.fileIcons[ext]) {
          return;
        }

        console.log('Getting icon for', ext);

        this.fileIcons[ext] = await window.ipcInvoke(
          getObjectImage,
          `foo.${ext}`,
        );
      };

      const allExtensions = {
        ...this.browserExtensions,
        ...this.transferExtensions,
      };

      await Promise.all(Object.keys(allExtensions).map(getImage));

      // Clean up icons that are no longer needed
      for (const ext of Object.keys(this.fileIcons)) {
        if (allExtensions[ext] == null) {
          console.log('Deleting icon for', ext);
          delete this.fileIcons[ext];
        }
      }

      console.log('--------------------------');
    },
  },
});
