import {
  S3Client,
  ListBucketsCommand,
  ListObjectsCommand,
  ListObjectsCommandInput,
} from '@aws-sdk/client-s3';
import {
  SerializedConnection,
  PersistedConnection,
  PersistedConnectionConfig,
} from '@shared/types/connections';

/**
 * S3 Connection class
 */
export default class Connection {
  id: string;
  nickname: string;
  config: PersistedConnectionConfig;
  client: S3Client;
  // currentTransferId: string | undefined;
  // transfers: any[] = [];

  constructor(connection: PersistedConnection) {
    this.id = connection.id;
    this.nickname = connection.nickname;
    this.config = connection.config;

    this.client = new S3Client(this.config);
  }

  async listBuckets() {
    return this.client.send(new ListBucketsCommand());
  }

  async listObjects(input: ListObjectsCommandInput) {
    return this.client.send(new ListObjectsCommand(input));
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
