import {
  ipcInvoke,
  onTransferUpdate,
  onTransferRemove,
  onWindowState,
} from '@preload/index';
import { serialize } from './utils';

declare global {
  interface Window {
    ipcInvoke: typeof ipcInvoke;
    serialize: typeof serialize;
    onTransferUpdate: typeof onTransferUpdate;
    onTransferRemove: typeof onTransferRemove;
    onWindowState: typeof onWindowState;
  }
}
