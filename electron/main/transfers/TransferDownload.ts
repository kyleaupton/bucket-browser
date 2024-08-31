import { createWriteStream, WriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import stream from 'stream';
import { BrowserWindow } from 'electron';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import {
  TransferInputDownload,
  TransferStatus,
  SerializedTransfer,
} from '@shared/types/transfers';
import Connection from '@main/connections/Connection';
import { getConnection } from '@main/connections';
import { exists, prettyEta } from '@main/utils';
import Transfer from './Transfer';
import { removeTransfer } from '.';

const pipeline = promisify(stream.pipeline);

export default class TransferDownload implements Transfer {
  id: string;
  status: TransferStatus;
  connection: Connection;
  /**
   * Options to pass to the S3 client to download the object
   */
  clientOptions: GetObjectCommandInput;
  /**
   * Path to save the downloaded file
   */
  downloadPath: string;
  /**
   * Name of the object to download
   */
  name: string;
  /**
   * Total bytes of the object to download
   */
  totalBytes: number;
  /**
   * Bytes downloaded overall
   */
  downloadedBytes: number;
  /**
   * Downloaded bytes in the current session
   */
  _downloadedBytes: number;
  /**
   * Start time of the download for the current session
   */
  startTime: number;
  /**
   * Stream to download the object
   */
  downloadStream: stream.Readable | undefined;
  /**
   * Stream to write the downloaded object
   */
  writeStream: WriteStream | undefined;
  /**
   * Interval that sends updates to the renderer
   */
  interval: ReturnType<typeof setInterval> | undefined;

  constructor(input: TransferInputDownload) {
    if (!input.clientOptions.Key) {
      throw new Error('Object key not found');
    }

    this.id = nanoid();
    this.status = 'queued';
    this.clientOptions = input.clientOptions;
    this.downloadPath = input.downloadPath;
    this.name = input.clientOptions.Key.split('/').pop()!;
    this.totalBytes = 0;
    this.downloadedBytes = 0;
    this._downloadedBytes = 0;
    this.startTime = -1;

    const connection = getConnection(input.connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    this.connection = connection;

    this.sendUpdate = this.sendUpdate.bind(this);
    this.removeTransfer = this.removeTransfer.bind(this);
  }

  get tempPath(): string {
    const dirname = path.dirname(this.downloadPath);
    const basename = path.basename(this.downloadPath);
    return path.join(dirname, `.download.${basename}`);
  }

  private async initialize(): Promise<void> {
    if (!this.connection.client) {
      throw new Error('Connection client not initialized');
    }

    this.status = 'initializing';
    this.sendUpdate();

    if (await exists(this.tempPath)) {
      const stats = await fs.stat(this.tempPath);
      this.downloadedBytes = stats.size;
      this.clientOptions.Range = `bytes=${this.downloadedBytes}-`;
    }

    const response = await this.connection.client.send(
      new GetObjectCommand(this.clientOptions),
    );

    if (!response.ContentLength || !response.Body) {
      throw new Error('Invalid response');
    }

    this.totalBytes = response.ContentRange
      ? parseInt(response.ContentRange.split('/')[1])
      : response.ContentLength;
    this.downloadStream = response.Body as stream.Readable;
  }

  private pipeStreams(): void {
    if (!this.downloadStream) {
      throw new Error('Download stream not found');
    }

    this.status = 'running';
    this.writeStream = createWriteStream(this.tempPath, { flags: 'a' });
    this.interval = setInterval(() => {
      this.sendUpdate();
    }, 500);

    const progressStream = new stream.Transform({
      transform: (chunk, encoding, callback): void => {
        this.downloadedBytes += chunk.length;
        this._downloadedBytes += chunk.length;
        callback(null, chunk);
      },
    });

    this.startTime = Date.now();
    this._downloadedBytes = 0;

    pipeline(this.downloadStream, progressStream, this.writeStream)
      .then(() => {
        console.log('TransferDownload: Download completed');
        this.finishTransfer();
      })
      .catch((err) => {
        console.error('Error downloading object:', err);
      });
  }

  async start(): Promise<void> {
    await this.initialize();
    this.pipeStreams();
  }

  async cancel(): Promise<void> {
    await fs.rm(this.tempPath);
    this.removeTransfer();
  }

  pause(): void {
    this.status = 'paused';
    this.cleanUp();
    this.sendUpdate();
  }

  resume(): void {
    if (this.status === 'paused') {
      this.start();
    }
  }

  sendUpdate(): void {
    BrowserWindow.getAllWindows().forEach((window) =>
      window.webContents.send('/transfers/update', this.serialize()),
    );
  }

  cleanUp(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.downloadStream) {
      this.downloadStream.destroy();
    }
    if (this.writeStream) {
      this.writeStream.close();
    }
  }

  async finishTransfer(): Promise<void> {
    await fs.rename(this.tempPath, this.downloadPath);
    this.removeTransfer();
  }

  removeTransfer(): void {
    removeTransfer(this.id);
    this.cleanUp();

    BrowserWindow.getAllWindows().forEach((window) =>
      window.webContents.send('/transfers/remove', this.id),
    );
  }

  serialize(): SerializedTransfer {
    // For speed we want to calculate the speed based on the bytes downloaded in the current session
    const speed =
      this._downloadedBytes / ((Date.now() - this.startTime) / 1000);

    return {
      id: this.id,
      name: this.name,
      type: 'download' as const,
      status: this.status,
      progress: {
        currentBytes: this.downloadedBytes,
        totalBytes: this.totalBytes,
        percentage: (this.downloadedBytes / this.totalBytes) * 100,
        speed,
        eta: prettyEta((this.totalBytes - this.downloadedBytes) / speed),
      },
    };
  }
}
