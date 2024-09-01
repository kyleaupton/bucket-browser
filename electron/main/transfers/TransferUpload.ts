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
  options: PutObjectCommandInput;

  constructor(input: TransferInputUpload) {
    this.id = nanoid();
    this.status = 'queued';
    this.options = input.options;
  }

  start() {}

  cancel() {}

  pause() {}

  resume() {}

  sendUpdate() {}

  serialize(): SerializedTransfer {
    return {
      id: this.id,
      name: this.options.Key || 'Unknown Name',
      type: 'upload' as const,
      status: this.status,
      progress: {
        currentBytes: 0,
        totalBytes: 0,
        percentage: 0,
        speed: 0,
        eta: '0s',
      },
    };
  }
}
