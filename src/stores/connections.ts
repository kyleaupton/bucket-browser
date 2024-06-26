import { defineStore } from 'pinia';
import { getConnectionsChannel } from '@shared/ipc/connections';
import { SerializedConnection } from '@shared/types/connections';

type State = {
  connections: SerializedConnection[];
};

export const useConnectionsStore = defineStore('connections', {
  state: (): State => ({
    connections: [],
  }),

  actions: {
    async getConnections() {
      this.connections = await window.ipcInvoke(getConnectionsChannel);
    },
  },
});
