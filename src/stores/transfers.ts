import { defineStore } from 'pinia';
import { SerializedTransfer } from '@shared/types/transfers';
import { ipcInvoke } from '@/ipc';
import { useLayoutStore } from '.';

type State = {
  transfers: Record<string, SerializedTransfer>;
};

export const useTransfersStore = defineStore('transfers', {
  state: (): State => ({
    transfers: {},
    // transfers: {
    //   UPEAiAilPsZXkFIBSG94_: {
    //     id: 'UPEAiAilPsZXkFIBSG94_',
    //     name: 'example.txt',
    //     type: 'download',
    //     status: 'running',
    //     progress: {
    //       currentBytes: 905468082,
    //       totalBytes: 1270805003,
    //       percentage: 71.25153582669678,
    //       speed: 1209310912,
    //       eta: '0:10',
    //     },
    //   },
    //   AAFADSFiAilPsZXkFIBSG94_: {
    //     id: 'AAFADSFiAilPsZXkFIBSG94_',
    //     name: 'example.txt',
    //     type: 'download',
    //     status: 'queued',
    //     progress: {
    //       currentBytes: 0,
    //       totalBytes: 0,
    //       percentage: 0,
    //       speed: 0,
    //       eta: '0s',
    //     },
    //   },
    // },
  }),

  actions: {
    async getTransfers() {
      this.transfers = await ipcInvoke('/transfers/get');
    },

    updateTransfer(transfer: SerializedTransfer) {
      let getIcon = false;
      if (this.transfers[transfer.id] == null) {
        // If a new transfer is added, get the file icon
        getIcon = true;
      }

      this.transfers[transfer.id] = transfer;

      if (getIcon) {
        const layoutStore = useLayoutStore();
        layoutStore.getFileIcons();
      }
    },

    registerTransferEvents() {
      window.onTransferUpdate((transfer) => {
        this.updateTransfer(transfer);
      });

      window.onTransferRemove((id) => {
        delete this.transfers[id];
        const layoutStore = useLayoutStore();
        layoutStore.getFileIcons();
      });
    },
  },
});
