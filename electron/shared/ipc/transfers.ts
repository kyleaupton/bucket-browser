import { IpcChannel } from 'typed-electron-ipc';
import {
  SerializedTransfer,
  TransferInputDownload,
  TransferInputUpload,
} from '@shared/types/transfers';

export const getTransfersChannel: IpcChannel<
  [],
  Record<string, SerializedTransfer>
> = {
  name: '/transfers/get',
};

export const addTransferChannel: IpcChannel<
  [TransferInputDownload | TransferInputUpload],
  SerializedTransfer
> = {
  name: '/transfers/add',
};

export const pauseTransferChannel: IpcChannel<[string], void> = {
  name: '/transfers/pause',
};

export const resumeTransferChannel: IpcChannel<[string], void> = {
  name: '/transfers/resume',
};

export const cancelTransferChannel: IpcChannel<[string], void> = {
  name: '/transfers/cancel',
};
