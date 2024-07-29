import { defineStore } from 'pinia';
import { ipcInvoke } from '@/ipc';
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
      this.connections = await ipcInvoke('/connections/get');
    },

    selectConnection(connectionId: string) {
      this.selectedConnection = connectionId;
    },

    async addConnection(connection: NewConnection) {
      await ipcInvoke('/connections/add', ...window.serialize(connection));
      await this.getConnections();
    },

    async editConnection(connection: NewConnection) {
      await ipcInvoke('/connections/edit', ...window.serialize(connection));
      await this.getConnections();
    },

    async removeConnection(connectionId: string) {
      await ipcInvoke('/connections/remove', connectionId);
      await this.getConnections();
    },
  },
});
