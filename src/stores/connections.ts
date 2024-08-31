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
      if (layoutStore.selectedConnection?.id === connection.id) {
        layoutStore.selectedConnection = undefined;
      }

      await ipcInvoke('/connections/remove', connection.id);
      await this.getConnections();
    },
  },
});
