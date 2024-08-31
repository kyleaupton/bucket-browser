import { BrowserWindow } from 'electron';
import {
  S3Client,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';
import {
  SerializedConnection,
  PersistedConnection,
} from '@shared/types/connections';
import { getPassword } from '@main/passwords';

/**
 * S3 Connection class
 */
export default class Connection {
  // Meta
  id: number;
  name: string;
  // Config
  accessKeyId: string;
  secretAccessKey: string | null;
  // Config
  region: string;
  endpoint: string;
  forcePathStyle: boolean;
  // State
  client: S3Client | undefined;
  error: string | undefined;

  constructor(connection: PersistedConnection) {
    // Meta
    this.id = connection.id;
    this.name = connection.name;
    // Creds
    this.accessKeyId = connection.accessKeyId;
    this.secretAccessKey = null;
    // Config
    this.region = connection.region;
    this.endpoint = connection.endpoint;
    this.forcePathStyle = connection.forcePathStyle === 1;
    // State
    this.error = undefined;
  }

  async initialize(): Promise<void> {
    this.secretAccessKey = await getPassword(this.name);

    if (this.secretAccessKey == null) {
      this.error = 'Secret access key not found';
    } else {
      this.client = new S3Client({
        region: this.region,
        endpoint: this.endpoint,
        forcePathStyle: this.forcePathStyle,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });
    }

    this.sendUpdate();
  }

  async listBuckets(): Promise<ListBucketsCommandOutput> {
    if (!this.client) {
      throw new Error('S3 Client not initialized');
    }

    return this.client.send(new ListBucketsCommand());
  }

  async listObjects(
    input: ListObjectsV2CommandInput,
  ): Promise<ListObjectsV2CommandOutput> {
    if (!this.client) {
      throw new Error('S3 Client not initialized');
    }

    return this.client.send(new ListObjectsV2Command(input));
  }

  serialize(): SerializedConnection {
    return {
      id: this.id,
      name: this.name,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: this.forcePathStyle === true ? 1 : 0,
      error: this.error,
    };
  }

  sendUpdate(): void {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('/connections/update', this.serialize());
    });
  }
}
