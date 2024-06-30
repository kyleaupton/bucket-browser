import { TransferStatus, SerializedTransfer } from '@shared/types/transfers';

export default interface Transfer {
  id: string;
  status: TransferStatus;
  start(): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  serialize(): SerializedTransfer;
}
