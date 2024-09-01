import { defineStore } from 'pinia';
import { ipcInvoke } from '@/ipc';
import {
  SerializedConnection,
  NewconnectionWithSecret,
  ConnectionId,
} from '@shared/types/connections';
import { useLayoutStore } from '@/stores';
import { serialize } from '@/utils';

type State = {
  connections: SerializedConnection[];
};

export const useConnectionsStore = defineStore('connections', {
  state: (): State => ({
    connections: [],
  }),

  getters: {
    getConnection:
      (state) =>
      (id: ConnectionId): SerializedConnection => {
        const connection = state.connections.find((c) => c.id === id);

        if (!connection) {
          throw new Error(`Connection with id ${id} not found`);
        }

        return connection;
      },
  },

  actions: {
    async getConnections() {
      this.connections = await ipcInvoke('/connections/get');
    },

    async addConnection(connection: NewconnectionWithSecret) {
      await ipcInvoke('/connections/add', serialize(connection));
      await this.getConnections();
    },

    async editConnection(
      id: ConnectionId,
      connection: NewconnectionWithSecret,
    ) {
      await ipcInvoke('/connections/edit', id, serialize(connection));
      await this.getConnections();
    },

    async removeConnection(connection: SerializedConnection) {
      // If the connection is selected, unselect it
      const layoutStore = useLayoutStore();
      if (layoutStore.selectedConnectionId === connection.id) {
        layoutStore.selectedConnectionId = undefined;
      }

      await ipcInvoke('/connections/remove', connection.id);
      await this.getConnections();
    },
  },
});
