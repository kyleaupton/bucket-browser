import {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

export type TransferType = 'upload' | 'download';

export type TransferStatus =
  | 'queued'
  | 'initializing'
  | 'running'
  | 'paused'
  | 'failed';

interface TransferInputBase {
  connectionId: string;
}

export interface TransferInputUpload extends TransferInputBase {
  sourcePath: string;
  clientOptions: PutObjectCommandInput;
}

export interface TransferInputDownload extends TransferInputBase {
  downloadPath: string;
  clientOptions: GetObjectCommandInput;
}

export type SerializedTransfer = {
  id: string;
  name: string;
  type: TransferType;
  status: TransferStatus;
  progress: {
    currentBytes: number;
    totalBytes: number;
    percentage: number;
    speed: number;
    eta: string;
  };
};

export const isTransferInputUpload = (
  item: TransferInputUpload | TransferInputDownload,
): item is TransferInputUpload => {
  return 'sourcePath' in item;
};

export const isTransferInputDownload = (
  item: TransferInputUpload | TransferInputDownload,
): item is TransferInputDownload => {
  return 'downloadPath' in item;
};
