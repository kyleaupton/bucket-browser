import { IpcChannel } from 'typed-electron-ipc';
import { SerializedConnection } from '@shared/types/connections';

export const getConnectionsChannel: IpcChannel<[], SerializedConnection[]> = {
  name: '/connections/get',
};
