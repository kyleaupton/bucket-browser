/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from '@main/ipc';

type ExcludeFirst<T extends any[]> = T extends [any, ...infer Rest] ? Rest : [];

export const ipcInvoke = async <
  C extends keyof Router & string,
  P extends ExcludeFirst<Parameters<Router[C]>>,
>(
  channel: C,
  ...args: NoInfer<P>
) => {
  const res = await window.ipcInvoke(channel, ...args);

  if (res && typeof res === 'object' && 'error' in res) {
    // @ts-expect-error - The encoded error is not typed
    const { name, message, extra } = res.error;
    const error = new Error(message);
    error.name = name;
    Object.assign(error, extra);
    throw error;
  }

  return res;
};
