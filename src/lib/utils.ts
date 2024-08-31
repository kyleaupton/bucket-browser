import type { Ref } from 'vue';
import type { Updater } from '@tanstack/vue-table';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const valueUpdater = <T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref,
): void => {
  ref.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue;
};
