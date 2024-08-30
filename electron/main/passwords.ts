/**
 * @file passwords.ts
 * @description Passwords management. In the future, I would like to
 * use Electron's safeStorage API to store passwords. Keytar is deprecated.
 */

import keytar from 'keytar';

const CONFIG = {
  service: 'Bucket Browser',
};

export const setPassword = async (account: string, password: string) => {
  return keytar.setPassword(CONFIG.service, account, password);
};

export const getPassword = async (account: string) => {
  return keytar.getPassword(CONFIG.service, account);
};

export const deletePassword = async (account: string) => {
  return keytar.deletePassword(CONFIG.service, account);
};
