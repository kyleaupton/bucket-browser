import { Bucket, _Object, CommonPrefix } from '@aws-sdk/client-s3';

export type Item = Bucket | _Object | CommonPrefix;

export const isBucket = (item: Item): item is Bucket => {
  return 'Name' in item;
};

export const isObject = (item: Item): item is _Object => {
  return 'Key' in item;
};

export const isFolder = (item: Item): boolean => {
  return 'Prefix' in item;
};

export const getKeyName = (item: Item) => {
  if (isBucket(item)) {
    return item.Name;
  } else if (isObject(item)) {
    const split = item.Key?.split('/') ?? [];
    return split[split.length - 1] ?? '';
  } else {
    const split = item.Prefix?.split('/') ?? [];
    return split[split.length - 2] ?? '';
  }
};
