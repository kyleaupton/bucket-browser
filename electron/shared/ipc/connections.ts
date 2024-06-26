import { IpcChannel } from 'typed-electron-ipc';
import { Connection } from '@shared/types/connections';

export const getConnectionsChannel: IpcChannel<[], Connection[]> = {
  name: '/connections/get',
};
