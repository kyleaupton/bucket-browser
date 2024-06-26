import { S3Client, S3ClientConfigType } from '@aws-sdk/client-s3';
import {
  SerializedConnection,
  PersistedConnection,
} from '@shared/types/connections';

/**
 * S3 Connection class
 */
export default class Connection {
  id: string;
  nickname: string;
  config: S3ClientConfigType;
  client: S3Client;

  constructor(connection: PersistedConnection) {
    this.id = connection.id;
    this.nickname = connection.nickname;
    this.config = connection.config;

    this.client = new S3Client(this.config);
  }

  serialize(): SerializedConnection {
    return {
      id: this.id,
      nickname: this.nickname,
      config: this.config,
      connected: true,
    };
  }
}
