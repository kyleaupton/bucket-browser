import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import { TransferInputDownload, TransferStatus } from '@shared/types/transfers';
import Connection from '@main/connections/Connection';
import { getConnection } from '@main/connections';
import Transfer from './Transfer';

const pipeline = promisify(stream.pipeline);

export default class TransferDownload implements Transfer {
  id: string;
  status: TransferStatus;
  connection: Connection;
  clientOptions: GetObjectCommandInput;
  downloadPath: string;
  totalBytes: number;
  downloadedBytes: number;
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
    this.writeStream = fs.createWriteStream(input.downloadPath);
    this.isPaused = false;
    this.isCanceled = false;

    const connection = getConnection(input.connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    this.connection = connection;
  }

  private async initialize() {
    this.status = 'initializing';

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

        this.downloadedBytes += chunk.length;
        console.log(
          `Progress: ${((this.downloadedBytes / this.totalBytes) * 100).toFixed(2)}%`,
        );
        callback(null, chunk);
      },
    });

    pipeline(this.downloadStream!, progressStream, this.writeStream)
      .then(() => {
        if (!this.isCanceled) {
          console.log(
            `Downloaded ${this.clientOptions.Key} to ${this.downloadPath}`,
          );
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
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.downloadStream!.resume();
      this.pipeStreams();
    }
  }

  serialize() {
    return {
      id: this.id,
      type: 'download' as const,
      status: this.status,
    };
  }
}
