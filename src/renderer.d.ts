import { ipcInvoke, onTransferUpdate, onTransferRemove } from '@preload/index';
import { serialize } from './utils';

declare global {
  interface Window {
    ipcInvoke: typeof ipcInvoke;
    serialize: typeof serialize;
    onTransferUpdate: typeof onTransferUpdate;
    onTransferRemove: typeof onTransferRemove;
  }
}
