import { registerConnectionsIpc } from './connections';
import { registerDialogIpc } from './dialog';

export const registerIpcChannels = () => {
  registerConnectionsIpc();
  registerDialogIpc();
};
