import { _ipcInvoke, onTransferUpdate, onTransferRemove } from '@preload/index';
import { serialize } from './utils';

declare global {
  interface Window {
    ipcInvoke: typeof _ipcInvoke;
    serialize: typeof serialize;
    onTransferUpdate: typeof onTransferUpdate;
    onTransferRemove: typeof onTransferRemove;
  }
}
