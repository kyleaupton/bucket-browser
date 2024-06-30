import { registerAppIpc } from './app';
import { registerConnectionsIpc } from './connections';
import { registerDialogIpc } from './dialog';
import { registerTransfersIpc } from './transfers';

export const registerIpcChannels = () => {
  registerAppIpc();
  registerConnectionsIpc();
  registerDialogIpc();
  registerTransfersIpc();
};
