import path from 'node:path';
import { exists } from '@main/utils';

export class MaxTryError extends Error {
  originalPath: string;
  lastTriedPath: string;

  constructor(originalPath: string, lastTriedPath: string) {
    super('Max tries reached.');

    this.originalPath = originalPath;
    this.lastTriedPath = lastTriedPath;
  }
}

const parenthesesIncrementer = (
  inputFilename: string,
  extension: string,
): [string, string] => {
  const match = inputFilename.match(/^(?<filename>.*)\((?<index>\d+)\)$/);

  // @ts-expect-error - match groups are not typed
  let { filename, index } = match
    ? match.groups
    : { filename: inputFilename, index: 0 };

  filename = filename.trim();
  return [`${filename}${extension}`, `${filename} (${++index})${extension}`];
};

const incrementPath = (
  filePath: string,
  incrementer: (path: string, ext: string) => [string, string] // eslint-disable-line
): [string, string] => {
  const ext = path.extname(filePath);
  const dirname = path.dirname(filePath);
  const [originalFilename, incrementedFilename] = incrementer(
    path.basename(filePath, ext),
    ext,
  );

  return [
    path.join(dirname, originalFilename),
    path.join(dirname, incrementedFilename),
  ];
};

export const unusedFilename = async (
  filePath: string,
  {
    incrementer = parenthesesIncrementer,
    maxTries = Number.POSITIVE_INFINITY,
  } = {},
): Promise<string> => {
  let tries = 0;
  let [originalPath] = incrementPath(filePath, incrementer);
  let unusedPath = filePath;

  /* eslint-disable no-await-in-loop, no-constant-condition */
  while (true) {
    if (!(await exists(unusedPath))) {
      return unusedPath;
    }

    if (++tries > maxTries) {
      throw new MaxTryError(originalPath, unusedPath);
    }

    [originalPath, unusedPath] = incrementPath(unusedPath, incrementer);
  }
  /* eslint-enable no-await-in-loop, no-constant-condition */
};
