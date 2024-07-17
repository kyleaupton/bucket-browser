import { ipcRouter } from 'typed-electron-ipc';
import { appIpc } from './app';
import { connectionsIpc } from './connections';
import { dialogIpc } from './dialog';
import { transfersIpc } from './transfers';

const router = ipcRouter({
  ...appIpc,
  ...connectionsIpc,
  ...dialogIpc,
  ...transfersIpc,
});

export type Router = typeof router;
