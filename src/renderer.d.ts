import { _ipcInvoke } from '@preload/index';

declare global {
  interface Window {
    ipcInvoke: typeof _ipcInvoke;
  }
}
