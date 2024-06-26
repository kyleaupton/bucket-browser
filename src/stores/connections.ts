import { defineStore } from 'pinia';
import { getConnectionsChannel } from '@shared/ipc/connections';
import { SerializedConnection } from '@shared/types/connections';

type State = {
  selectedConnection?: string;
  connections: SerializedConnection[];
};

export const useConnectionsStore = defineStore('connections', {
  state: (): State => ({
    selectedConnection: undefined,
    connections: [],
  }),

  actions: {
    async getConnections() {
      this.connections = await window.ipcInvoke(getConnectionsChannel);
    },

    selectConnection(connectionId: string) {
      this.selectedConnection = connectionId;
    },
  },
});
