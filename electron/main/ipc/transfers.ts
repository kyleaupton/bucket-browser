import { ipcHandle } from 'typed-electron-ipc';
import { addTransfer, getTransfers } from '@main/transfers';
import TransferDownload from '@main/transfers/TransferDownload';
import TransferUpload from '@main/transfers/TransferUpload';
import {
  isTransferInputDownload,
  isTransferInputUpload,
} from '@shared/types/transfers';
import {
  getTransfersChannel,
  addTransferChannel,
  pauseTransferChannel,
  resumeTransferChannel,
  cancelTransferChannel,
} from '@shared/ipc/transfers';

export const registerTransfersIpc = () => {
  ipcHandle(getTransfersChannel, async () => {
    const transfers = getTransfers();

    return Object.fromEntries(
      Array.from(transfers.values()).map((transfer) => [
        transfer.id,
        transfer.serialize(),
      ]),
    );
  });

  ipcHandle(addTransferChannel, async (event, input) => {
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
  });

  ipcHandle(pauseTransferChannel, async (event, id) => {
    const transfer = getTransfers().get(id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    transfer.pause();
  });

  ipcHandle(resumeTransferChannel, async (event, id) => {
    const transfer = getTransfers().get(id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    transfer.resume();
  });

  ipcHandle(cancelTransferChannel, async (event, id) => {
    const transfer = getTransfers().get(id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    transfer.cancel();
  });
};
