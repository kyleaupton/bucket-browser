import { contextBridge } from 'electron';
import { ipcInvoke } from 'typed-electron-ipc';

import { getConnectionsChannel } from '@shared/ipc/connections';

export const api = {
  getConnections: () => {
    return ipcInvoke(getConnectionsChannel);
  },
};

contextBridge.exposeInMainWorld('api', api);
