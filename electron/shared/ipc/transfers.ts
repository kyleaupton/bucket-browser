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
