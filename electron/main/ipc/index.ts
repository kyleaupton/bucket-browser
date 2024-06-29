import { registerAppIpc } from './app';
import { registerConnectionsIpc } from './connections';
import { registerDialogIpc } from './dialog';

export const registerIpcChannels = () => {
  registerAppIpc();
  registerConnectionsIpc();
  registerDialogIpc();
};
