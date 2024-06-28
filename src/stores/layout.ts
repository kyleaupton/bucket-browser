import { defineStore } from 'pinia';
import { PersistedConnection } from '@shared/types/connections';

type Dialog = {
  name: 'connection';
  data?: PersistedConnection;
};

type State = {
  dialog: Dialog | undefined;
};

export const useLayoutStore = defineStore('layout', {
  state: (): State => ({
    dialog: undefined,
  }),

  actions: {
    setDialog(dialog: Dialog) {
      this.dialog = dialog;
    },

    closeDialog() {
      this.dialog = undefined;
    },
  },
});
