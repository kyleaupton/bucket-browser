import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import {
  TransferStatus,
  TransferInputUpload,
  SerializedTransfer,
} from '@shared/types/transfers';
import Transfer from './Transfer';

export default class TransferUpload implements Transfer {
  id: string;
  status: TransferStatus;
  clientOptions: PutObjectCommandInput;

  constructor(input: TransferInputUpload) {
    this.id = nanoid();
    this.status = 'queued';
    this.clientOptions = input.clientOptions;
  }

  start() {}

  cancel() {}

  pause() {}

  resume() {}

  sendUpdate() {}

  serialize(): SerializedTransfer {
    return {
      id: this.id,
      name: this.clientOptions.Key || 'Unknown Name',
      type: 'upload' as const,
      status: this.status,
      progress: {
        currentBytes: 0,
        totalBytes: 0,
        percentage: 0,
        eta: '0s',
      },
    };
  }
}
