import { CSSProperties } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { ipcInvoke } from '@/ipc';
import { Item } from '@/components/browser/utils';
import { useLayoutStore } from './layout';

export interface Column {
  key: string;
  title: string;
  style: CSSProperties;
  sortable: boolean;
}

type State = {
  items: Item[];
  fetching: boolean;
  loading: boolean;
  currentPage: number;
  pageMarkers: Map<number, string>;
  columns: Column[];
  sort: {
    key: string;
    order: 'asc' | 'desc';
  };
  error: unknown;
};

export const useBrowserStore = defineStore('browser', {
  state: (): State => ({
    items: [],
    fetching: false,
    loading: false,
    currentPage: 1,
    pageMarkers: new Map(),
    columns: [
      {
        key: 'icon',
        title: '',
        style: {
          width: '32px',
          flexShrink: 0,
          boxSizing: 'content-box',
        },
        sortable: false,
      },
      {
        key: 'name',
        title: 'Name',
        style: {
          flexGrow: 1,
        },
        sortable: true,
      },
      {
        key: 'size',
        title: 'Size',
        style: {
          width: '62px',
          flexShrink: 0,
          boxSizing: 'content-box',
        },
        sortable: true,
      },
      {
        key: 'more',
        title: '',
        style: {
          width: '62px',
          flexShrink: 0,
        },
        sortable: false,
      },
    ],
    sort: {
      key: '',
      order: 'asc',
    },
    error: undefined,
  }),

  getters: {
    itemsSorted(state) {
      if (state.sort.key === 'name') {
        return state.items.slice().sort((a, b) => {
          const _a = state.sort.order === 'asc' ? a : b;
          const _b = state.sort.order === 'asc' ? b : a;

          return _a.name.localeCompare(_b.name);
        });
      } else if (state.sort.key === 'size') {
        return state.items.slice().sort((a, b) => {
          const _a = state.sort.order === 'asc' ? a : b;
          const _b = state.sort.order === 'asc' ? b : a;

          if (
            _a.type === 'object' &&
            _b.type === 'object' &&
            _a.size != null &&
            _b.size != null
          ) {
            return _b.size - _a.size;
          }

          return -1;
        });
      }

      return state.items;
    },

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
      try {
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
            const res = await ipcInvoke(
              '/connections/list-buckets',
              selectedConnection.value.id,
            );

            console.log(res);

            for (const bucket of res.Buckets || []) {
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
            const res = await ipcInvoke(
              '/connections/list-objects',
              selectedConnection.value.id,
              {
                Bucket: selectedBucket.value,
                Prefix: selectedObject.value ? `${selectedObject.value}/` : '',
                Delimiter: '/',
                ContinuationToken: this.pageMarkers.get(this.currentPage),
              },
            );

            console.log(res);

            if (res.IsTruncated && res.NextContinuationToken) {
              this.pageMarkers.set(
                this.currentPage + 1,
                res.NextContinuationToken,
              );
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
      } catch (e) {
        this.error = e;
      }
    },

    setSort(key: string) {
      if (this.sort.key === key) {
        if (this.sort.order === 'asc') {
          this.sort.order = 'desc';
        } else if (this.sort.order === 'desc') {
          this.sort.key = '';
          this.sort.order = 'asc';
        }
      } else {
        this.sort.key = key;
        this.sort.order = 'asc';
      }
    },
  },
});
