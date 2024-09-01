import { ipcRouter } from 'typed-electron-ipc';
import { appIpc } from './app';
import { connectionsIpc } from './connections';
import { dialogIpc } from './dialog';
import { transfersIpc } from './transfers';
import { windowIpc } from './window';

const router = ipcRouter(
  {
    ...appIpc,
    ...connectionsIpc,
    ...dialogIpc,
    ...transfersIpc,
    ...windowIpc,
  },
  {
    encodeErrors: true,
  },
);

export type Router = typeof router;
