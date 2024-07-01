import { defineStore } from 'pinia';
import { getTransfersChannel, addTransferChannel } from '@shared/ipc/transfers';
import {
  SerializedTransfer,
  TransferInputDownload,
  TransferInputUpload,
} from '@shared/types/transfers';

type State = {
  transfers: Record<string, SerializedTransfer>;
};

export const useTransfersStore = defineStore('transfers', {
  state: (): State => ({
    // transfers: {
    //   UPEAiAilPsZXkFIBSG94_: {
    //     id: 'UPEAiAilPsZXkFIBSG94_',
    //     name: 'example.txt',
    //     type: 'download',
    //     status: 'initializing',
    //     progress: {
    //       currentBytes: 905468082,
    //       totalBytes: 1270805003,
    //       percentage: 71.25153582669678,
    //       eta: '0s',
    //     },
    //   },
    // },
    transfers: {},
  }),

  actions: {
    async getTransfers() {
      this.transfers = await window.ipcInvoke(getTransfersChannel);
    },

    async addTransfer(input: TransferInputUpload | TransferInputDownload) {
      await window.ipcInvoke(addTransferChannel, input);
    },

    updateTransfer(transfer: SerializedTransfer) {
      this.transfers[transfer.id] = transfer;
    },

    registerTransferEvents() {
      window.onTransferUpdate((transfer) => {
        console.log(transfer);
        this.updateTransfer(transfer);
      });

      window.onTransferRemove((id) => {
        delete this.transfers[id];
      });
    },
  },
});
