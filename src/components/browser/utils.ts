// interface ItemBase {
//   key: string;
// }

// export interface Bucket extends ItemBase {
//   type: 'bucket';
//   name: string;
//   creationDate?: Date;
// }

// export interface _Object extends ItemBase {
//   type: 'object';
//   name: string;
//   lastModified?: Date;
//   size?: number;
// }

// export interface Folder extends ItemBase {
//   type: 'folder';
//   name: string;
// }

// export type Item = Bucket | _Object | Folder;

export interface Item {
  key: string;
  type: 'bucket' | 'object' | 'folder';
  name: string;
  creationDate?: Date;
  lastModified?: Date;
  size?: number;
}
