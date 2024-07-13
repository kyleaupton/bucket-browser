import { defineStore } from 'pinia';
import {
  getConnectionsChannel,
  addConnectionChannel,
  editConnectionChannel,
  removeConnectionChannel,
} from '@shared/ipc/connections';
import { SerializedConnection, NewConnection } from '@shared/types/connections';

type State = {
  selectedConnection: string | undefined;
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

    async addConnection(connection: NewConnection) {
      await window.ipcInvoke(
        addConnectionChannel,
        ...window.serialize(connection),
      );
      await this.getConnections();
    },

    async editConnection(connection: NewConnection) {
      await window.ipcInvoke(
        editConnectionChannel,
        ...window.serialize(connection),
      );
      await this.getConnections();
    },

    async removeConnection(connectionId: string) {
      await window.ipcInvoke(removeConnectionChannel, connectionId);
      await this.getConnections();
    },
  },
});
