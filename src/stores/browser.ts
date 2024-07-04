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
  currentPage: number;
  pageMarkers: Map<number, string>;
};

export const useBrowserStore = defineStore('browser', {
  state: (): State => ({
    items: [],
    fetching: false,
    loading: false,
    currentPage: 1,
    pageMarkers: new Map(),
  }),

  getters: {
    isTruncated(state) {
      return state.pageMarkers.size > 0;
    },
  },

  actions: {
    async fetchItems({
      nextPage = false,
      prevPage = false,
      clearPageMarkers = false,
    } = {}) {
      if (clearPageMarkers) {
        this.pageMarkers.clear();
        this.currentPage = 1;
      } else if (nextPage) {
        this.currentPage++;
      } else if (prevPage) {
        this.currentPage--;
      }

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
          const res = await window.ipcInvoke(
            listObjectsChannel,
            selectedConnection.value.id,
            {
              Bucket: selectedBucket.value,
              Prefix: selectedObject.value ? `${selectedObject.value}/` : '',
              Delimiter: '/',
              Marker: this.pageMarkers.get(this.currentPage),
            },
          );

          if (res.IsTruncated && res.NextMarker) {
            this.pageMarkers.set(this.currentPage + 1, res.NextMarker);
          }

          const _contents = res.Contents || [];
          const _commonPrefixes = res.CommonPrefixes || [];

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
