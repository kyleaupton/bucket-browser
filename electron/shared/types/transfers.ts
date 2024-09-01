import {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ConnectionId } from '@shared/types/connections';

export type TransferType = 'upload' | 'download';

export type TransferStatus =
  | 'queued'
  | 'initializing'
  | 'running'
  | 'paused'
  | 'failed';

interface TransferInputBase {
  connectionId: ConnectionId;
}

export interface TransferInputUpload extends TransferInputBase {
  sourcePath: string;
  options: PutObjectCommandInput;
}

export interface TransferInputDownload extends TransferInputBase {
  options: GetObjectCommandInput;
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
