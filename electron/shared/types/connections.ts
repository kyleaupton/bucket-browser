export type PersistedConnectionConfig = {
  endpoint?: string;
  region?: string;
  forcePathStyle?: boolean;
};

export type PersistedConnection = {
  nickname: string;
  id: string;
  config: PersistedConnectionConfig;
  accessKeyId: string;
};

export type NewConnection = PersistedConnection & {
  secretAccessKey: string;
};

export type SerializedConnection = PersistedConnection & {
  secretAccessKey: string | null;
  error: string | undefined;
};
