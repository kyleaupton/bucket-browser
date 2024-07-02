import fs from 'fs';
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
import { removeTransfer } from '.';
import Transfer from './Transfer';
import { prettyEta } from './utils';

const pipeline = promisify(stream.pipeline);

export default class TransferDownload implements Transfer {
  id: string;
  status: TransferStatus;
  connection: Connection;
  clientOptions: GetObjectCommandInput;
  downloadPath: string;
  totalBytes: number;
  downloadedBytes: number;
  speed: number;
  eta: string;
  startTime: number;
  downloadStream: stream.Readable | undefined;
  writeStream: fs.WriteStream;
  isPaused: boolean;
  isCanceled: boolean;

  constructor(input: TransferInputDownload) {
    this.id = nanoid();
    this.status = 'queued';
    this.clientOptions = input.clientOptions;
    this.downloadPath = input.downloadPath;
    this.totalBytes = 0;
    this.downloadedBytes = 0;
    this.speed = -1;
    this.eta = '';
    this.startTime = -1;
    this.writeStream = fs.createWriteStream(input.downloadPath);
    this.isPaused = false;
    this.isCanceled = false;

    const connection = getConnection(input.connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    this.connection = connection;

    this.sendUpdate = this.sendUpdate.bind(this);
    this.removeTransfer = this.removeTransfer.bind(this);
  }

  private async initialize() {
    this.status = 'initializing';
    this.sendUpdate();

    const response = await this.connection.client.send(
      new GetObjectCommand(this.clientOptions),
    );

    if (!response.ContentLength || !response.Body) {
      throw new Error('Invalid response');
    }

    this.totalBytes = response.ContentLength;
    this.downloadStream = response.Body as stream.Readable;
  }

  private pipeStreams() {
    const progressStream = new stream.Transform({
      transform: (chunk, encoding, callback) => {
        if (this.isCanceled) {
          callback(new Error('Download canceled'));
          return;
        }

        if (this.isPaused) {
          this.downloadStream!.pause();
          return callback();
        }

        this.status = 'running';
        this.downloadedBytes += chunk.length;
        this.speed =
          this.startTime !== -1
            ? this.downloadedBytes / ((Date.now() - this.startTime) / 1000)
            : 0;
        this.eta =
          this.speed !== -1
            ? prettyEta((this.totalBytes - this.downloadedBytes) / this.speed)
            : '';

        if (this.startTime === -1) this.startTime = Date.now();
        this.sendUpdate();
        callback(null, chunk);
      },
    });

    pipeline(this.downloadStream!, progressStream, this.writeStream)
      .then(() => {
        if (!this.isCanceled) {
          this.removeTransfer();
        }
      })
      .catch((err) => {
        console.error('Error downloading object:', err);
      });
  }

  async start() {
    await this.initialize();
    this.pipeStreams();
  }

  cancel() {
    this.isCanceled = true;
    this.downloadStream!.destroy();
    this.writeStream.close();
    this.sendUpdate();
  }

  pause() {
    this.isPaused = true;
    this.startTime = -1;
    this.sendUpdate();
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.downloadStream!.resume();
      this.pipeStreams();
    }

    this.sendUpdate();
  }

  sendUpdate() {
    BrowserWindow.getAllWindows().forEach((window) =>
      window.webContents.send('/transfers/update', this.serialize()),
    );
  }

  removeTransfer() {
    removeTransfer(this.id);
    BrowserWindow.getAllWindows().forEach((window) =>
      window.webContents.send('/transfers/remove', this.id),
    );
  }

  serialize(): SerializedTransfer {
    return {
      id: this.id,
      name: this.clientOptions.Key || 'Unknown Name',
      type: 'download' as const,
      status: this.status,
      progress: {
        currentBytes: this.downloadedBytes,
        totalBytes: this.totalBytes,
        percentage: (this.downloadedBytes / this.totalBytes) * 100,
        speed: this.speed,
        eta: '0s',
      },
    };
  }
}
