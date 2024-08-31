import { defineStore } from 'pinia';
import { ipcInvoke } from '@/ipc';
import {
  SerializedConnection,
  NewconnectionWithSecret,
  ConnectionId,
} from '@shared/types/connections';
import { serialize } from '@/utils';

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

    async addConnection(connection: NewconnectionWithSecret) {
      await ipcInvoke('/connections/add', serialize(connection));
      await this.getConnections();
    },

    async editConnection(
      id: ConnectionId,
      connection: NewconnectionWithSecret,
    ) {
      await ipcInvoke('/connections/remove', id);
      await ipcInvoke('/connections/add', serialize(connection));
      await this.getConnections();
    },

    async removeConnection(id: ConnectionId) {
      await ipcInvoke('/connections/remove', id);
      await this.getConnections();
    },
  },
});
