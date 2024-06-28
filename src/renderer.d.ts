import { _ipcInvoke } from '@preload/index';
import { serialize } from './utils';

declare global {
  interface Window {
    ipcInvoke: typeof _ipcInvoke;
    serialize: typeof serialize;
  }
}
