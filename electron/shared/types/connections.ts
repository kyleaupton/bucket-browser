import { S3ClientConfigType } from '@aws-sdk/client-s3';

export type PersistedConnectionConfig = {
  endpoint?: string;
  region?: string;
  credentials?: S3ClientConfigType['credentials'];
  forcePathStyle?: S3ClientConfigType['forcePathStyle'];
};

export type PersistedConnection = {
  // General
  nickname: string;
  id: string;
  config: PersistedConnectionConfig;
};

export type SerializedConnection = PersistedConnection & {
  connected: boolean;
};
