import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import { TransferStatus, TransferInputUpload } from '@shared/types/transfers';
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

  serialize() {
    return {
      id: this.id,
      type: 'upload' as const,
      status: this.status,
    };
  }
}
