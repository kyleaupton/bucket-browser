import TransferDownload from './TransferDownload';
import TransferUpload from './TransferUpload';

type Transfer = TransferDownload | TransferUpload;
const transfers = new Map<string, Transfer>();

export const getTransfers = () => {
  return transfers;
};

export const getTransfer = (id: string) => {
  return transfers.get(id);
};

export const addTransfer = (transfer: Transfer) => {
  transfers.set(transfer.id, transfer);
  nextTransfer();
};

export const pauseTransfer = (id: string) => {
  const transfer = getTransfer(id);
  if (!transfer) {
    return;
  }

  transfer.pause();
  nextTransfer();
};

export const resumeTransfer = (id: string) => {
  const transfer = getTransfer(id);
  if (!transfer) {
    return;
  }

  transfer.resume();
  nextTransfer();
};

export const cancelTransfer = (id: string) => {
  const transfer = getTransfer(id);
  if (!transfer) {
    return;
  }

  transfer.cancel();
  transfers.delete(id);
  nextTransfer();
};

export const removeTransfer = (id: string) => {
  transfers.delete(id);
  nextTransfer();
};

/**
 * Start the next transfer in the queue if possible.
 */
const nextTransfer = () => {
  // Only start the next transfer if there are no active transfers
  // and there are queued transfers
  const transferArr = Array.from(transfers.values());

  if (transferArr.some((transfer) => transfer.status === 'running')) {
    return;
  }

  const next = transferArr.find((transfer) => transfer.status === 'queued');

  if (next) {
    next.start();
  }
};
