export type PersistedConnectionConfig = {
  endpoint?: string;
  region?: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  forcePathStyle?: boolean;
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
