import { MessageBoxOptions, MessageBoxReturnValue } from 'electron';
import { IpcChannel } from 'typed-electron-ipc';

export const showMessageChannel: IpcChannel<
  [MessageBoxOptions],
  MessageBoxReturnValue
> = {
  name: '/dialog/show-message-box',
};
