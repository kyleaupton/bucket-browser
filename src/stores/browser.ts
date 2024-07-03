import { defineStore, storeToRefs } from 'pinia';
import {
  listBucketsChannel,
  listObjectsChannel,
} from '@shared/ipc/connections';
import { Item } from '@/components/browser/utils';
import { useLayoutStore } from './layout';

type State = {
  items: Item[];
  fetching: boolean;
  loading: boolean;
};

export const useBrowserStore = defineStore('browser', {
  state: (): State => ({
    items: [],
    fetching: false,
    loading: false,
  }),

  actions: {
    async fetchItems() {
      const layoutStore = useLayoutStore();
      const { selectedConnection, selectedBucket, selectedObject } =
        storeToRefs(layoutStore);

      if (selectedConnection.value) {
        this.items = [];
        this.fetching = true;

        // Only display spinner if fetching takes longer than .5 second
        const timeout = setTimeout(() => {
          this.loading = true;
        }, 500);

        if (!selectedBucket.value) {
          const { Buckets } = await window.ipcInvoke(
            listBucketsChannel,
            selectedConnection.value.id,
          );

          this.items = Buckets || [];
        } else {
          const { Contents, CommonPrefixes } = await window.ipcInvoke(
            listObjectsChannel,
            selectedConnection.value.id,
            {
              Bucket: selectedBucket.value,
              Prefix: selectedObject.value ? `${selectedObject.value}/` : '',
              Delimiter: '/',
            },
          );

          const _contents = Contents || [];
          const _commonPrefixes = CommonPrefixes || [];

          this.items = [..._commonPrefixes, ..._contents];
        }

        await layoutStore.getFileIcons();

        this.loading = false;
        this.fetching = false;
        clearTimeout(timeout);
      }
    },
  },
});
