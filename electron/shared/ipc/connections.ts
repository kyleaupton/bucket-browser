import { ListBucketsCommandOutput } from '@aws-sdk/client-s3';
import { IpcChannel } from 'typed-electron-ipc';
import {
  PersistedConnection,
  SerializedConnection,
} from '@shared/types/connections';

export const getConnectionsChannel: IpcChannel<[], SerializedConnection[]> = {
  name: '/connections/get',
};

export const addConnectionChannel: IpcChannel<[PersistedConnection], void> = {
  name: '/connections/add',
};

export const editConnectionChannel: IpcChannel<[PersistedConnection], void> = {
  name: '/connections/edit',
};

export const removeConnectionChannel: IpcChannel<[string], void> = {
  name: '/connections/remove',
};

export const listBucketsChannel: IpcChannel<
  [string],
  ListBucketsCommandOutput
> = {
  name: '/connections/list-buckets',
};
