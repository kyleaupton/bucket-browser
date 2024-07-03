// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serialize = <T extends any[]>(...args: T) => {
  return JSON.parse(JSON.stringify(args)) as T;
};

export const getObjectName = (key: string) => {
  return key.split('/').pop()!;
};

export const getExtension = (filename: string) => {
  // If object is dotfile, remove the dot
  if (filename.startsWith('.')) {
    filename = filename.slice(1);
  }

  const split = filename.split('.');
  // If item has no extension, return empty string
  return split.length > 1 ? split.pop()! : '';
};
