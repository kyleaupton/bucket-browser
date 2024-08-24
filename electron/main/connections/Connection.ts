import { BrowserWindow } from 'electron';
import keytar from 'keytar';
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
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
  accessKeyId: string;
  secretAccessKey: string | null;
  config: PersistedConnectionConfig;
  client: S3Client | undefined;
  error: string | undefined;

  constructor(connection: PersistedConnection) {
    this.id = connection.id;
    this.nickname = connection.nickname;
    this.accessKeyId = connection.accessKeyId;
    this.secretAccessKey = null;
    this.config = connection.config;
    this.error = undefined;
  }

  async initialize() {
    this.secretAccessKey = await keytar.getPassword('bucket-browser', this.id);

    if (this.secretAccessKey == null) {
      this.error = 'Secret access key not found';
    } else {
      this.client = new S3Client({
        ...this.config,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });
    }

    this.sendUpdate();
  }

  async listBuckets() {
    if (!this.client) {
      throw new Error('S3 Client not initialized');
    }

    return this.client.send(new ListBucketsCommand());
  }

  async listObjects(input: ListObjectsV2CommandInput) {
    if (!this.client) {
      throw new Error('S3 Client not initialized');
    }

    return this.client.send(new ListObjectsV2Command(input));
  }

  serialize(): SerializedConnection {
    return {
      id: this.id,
      nickname: this.nickname,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      config: this.config,
      error: this.error,
    };
  }

  sendUpdate() {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('/connections/update', this.serialize());
    });
  }
}
