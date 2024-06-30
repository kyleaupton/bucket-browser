import { defineStore } from 'pinia';
import { getTransfersChannel, addTransferChannel } from '@shared/ipc/transfers';
import {
  SerializedTransfer,
  TransferInputDownload,
  TransferInputUpload,
} from '@shared/types/transfers';

type State = {
  transfers: SerializedTransfer[];
};

export const useTransfersStore = defineStore('transfers', {
  state: (): State => ({
    transfers: [],
  }),

  actions: {
    async getTransfers() {
      this.transfers = await window.ipcInvoke(getTransfersChannel);
    },

    async addTransfer(input: TransferInputUpload | TransferInputDownload) {
      await window.ipcInvoke(addTransferChannel, input);
      await this.getTransfers();
    },
  },
});
