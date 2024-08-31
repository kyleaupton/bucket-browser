import { Generated } from 'kysely';

export interface Database {
  connection: ConnectionTable;
}

export interface ConnectionTable {
  id: Generated<number>;
  name: string;
  accessKeyId: string;
  region: string;
  endpoint: string;
  forcePathStyle: number;
}
