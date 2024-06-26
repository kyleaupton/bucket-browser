import { ListBucketsCommandOutput } from '@aws-sdk/client-s3';
import { IpcChannel } from 'typed-electron-ipc';
import { SerializedConnection } from '@shared/types/connections';

export const getConnectionsChannel: IpcChannel<[], SerializedConnection[]> = {
  name: '/connections/get',
};

export const listBucketsChannel: IpcChannel<
  [string],
  ListBucketsCommandOutput
> = {
  name: '/connections/list-buckets',
};
