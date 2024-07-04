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
        const payload: Item[] = [];

        // Only display spinner if fetching takes longer than .5 second
        const timeout = setTimeout(() => {
          this.loading = true;
        }, 500);

        if (!selectedBucket.value) {
          const { Buckets } = await window.ipcInvoke(
            listBucketsChannel,
            selectedConnection.value.id,
          );

          for (const bucket of Buckets || []) {
            if (bucket.Name) {
              payload.push({
                type: 'bucket',
                key: bucket.Name,
                name: bucket.Name,
                creationDate: bucket.CreationDate,
              });
            }
          }
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

          console.log(res);

          if (res.IsTruncated && res.NextMarker) {
            this.pageMarkers.set(this.currentPage + 1, res.NextMarker);
          }

          for (const item of res.CommonPrefixes || []) {
            if (item.Prefix) {
              const name = item.Prefix.split('/').filter(Boolean).pop()!;

              payload.push({
                type: 'folder',
                key: item.Prefix,
                name,
              });
            }
          }

          for (const item of res.Contents || []) {
            if (item.Key) {
              const name = item.Key.split('/').pop()!;

              payload.push({
                type: 'object',
                key: item.Key,
                name,
                lastModified: item.LastModified,
                size: item.Size,
              });
            }
          }
        }

        this.items = payload;
        await layoutStore.getFileIcons();

        this.loading = false;
        this.fetching = false;
        clearTimeout(timeout);
      }
    },
  },
});
