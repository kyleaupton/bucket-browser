interface ItemBase {
  key: string;
}

export interface Bucket extends ItemBase {
  type: 'bucket';
  name: string;
  creationDate?: Date;
}

export interface _Object extends ItemBase {
  type: 'object';
  name: string;
  lastModified?: Date;
  size?: number;
}

export interface Folder extends ItemBase {
  type: 'folder';
  name: string;
}

export type Item = Bucket | _Object | Folder;

export const isBucket = (item: Item): item is Bucket => {
  return 'Name' in item;
};

export const isObject = (item: Item): item is _Object => {
  return 'Key' in item;
};

export const isFolder = (item: Item): boolean => {
  return 'Prefix' in item;
};
