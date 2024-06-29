import { defineStore } from 'pinia';
import { getBucketImage, getFolderImage } from '@shared/ipc/app';
import { PersistedConnection } from '@shared/types/connections';

type Dialog = {
  name: 'connection';
  data?: PersistedConnection;
};

type State = {
  path: string;
  dialog: Dialog | undefined;
  folderIcon: string;
  bucketIcon: string;
};

export const useLayoutStore = defineStore('layout', {
  state: (): State => ({
    path: '',
    dialog: undefined,
    folderIcon: '',
    bucketIcon: '',
  }),

  actions: {
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
      ]);

      this.bucketIcon = res[0];
      this.folderIcon = res[1];
    },
  },
});
