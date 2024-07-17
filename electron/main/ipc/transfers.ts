import { createIpcHandlers } from 'typed-electron-ipc';
import { addTransfer, getTransfers } from '@main/transfers';
import TransferDownload from '@main/transfers/TransferDownload';
import TransferUpload from '@main/transfers/TransferUpload';
import {
  isTransferInputDownload,
  isTransferInputUpload,
  TransferInputDownload,
  TransferInputUpload,
} from '@shared/types/transfers';

export const transfersIpc = createIpcHandlers({
  '/transfers/get': async () => {
    const transfers = getTransfers();

    return Object.fromEntries(
      Array.from(transfers.values()).map((transfer) => [
        transfer.id,
        transfer.serialize(),
      ]),
    );
  },

  '/transfers/add': async (
    event,
    input: TransferInputDownload | TransferInputUpload,
  ) => {
    let transfer: TransferDownload | TransferUpload;

    if (isTransferInputDownload(input)) {
      transfer = new TransferDownload(input);
    } else if (isTransferInputUpload(input)) {
      transfer = new TransferUpload(input);
    } else {
      throw new Error('Invalid transfer input');
    }

    addTransfer(transfer);
    return transfer.serialize();
  },

  '/transfers/pause': async (event, id: string) => {
    const transfer = getTransfers().get(id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    transfer.pause();
  },

  '/transfers/resume': async (event, id: string) => {
    const transfer = getTransfers().get(id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    transfer.resume();
  },

  '/transfers/cancel': async (event, id: string) => {
    const transfer = getTransfers().get(id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    transfer.cancel();
  },
});
